import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/global.css";

import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Buffer } from "buffer";

window.Buffer = Buffer;

const VotePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const publicKeyString = location.state?.publicKey;
  const publicKey = publicKeyString ? new PublicKey(publicKeyString) : null;

  const candidates = ["Alice", "Bob", "Charlie", "David"];
  const [selected, setSelected] = useState("");

  const sendVoteToSolana = async (voteNumber) => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        alert("Phantom 지갑이 설치되어 있지 않습니다.");
        return null;
      }

      if (!publicKey) {
        alert("지갑 주소가 전달되지 않았습니다.");
        return null;
      }

      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");

      const { blockhash } = await connection.getLatestBlockhash("confirmed");

      const memoMessage = `vote:${voteNumber}`;
      const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

      const instruction = new TransactionInstruction({
        keys: [],
        programId: memoProgramId,
        data: Buffer.from(memoMessage),
      });

      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: blockhash,
      }).add(instruction);

      const { signature } = await window.solana.signAndSendTransaction(transaction);
      console.log("🎉 트랜잭션 서명:", signature);

      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      console.log("📦 블록체인 확인 완료:", confirmation);

      return signature;
    } catch (error) {
      if (error.message.includes("User rejected")) {
        alert("❌ 지갑 서명을 거부하셨습니다.");
      } else {
        console.error("❌ 블록체인 트랜잭션 실패:", error);
        alert("블록체인에 투표 저장 중 오류가 발생했습니다.");
      }
      return null;
    }
  };

  const handleVote = async () => {
    if (!selected) {
      alert("후보를 선택해주세요!");
      return;
    }

    const voteNumber = candidates.indexOf(selected) + 1;

    const signature = await sendVoteToSolana(voteNumber);
    if (!signature) return;

    try {
      const response = await fetch("http://localhost:8000/api/log/save-signature/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("서명 저장 실패:", result.message);
        alert("트랜잭션은 성공했지만 서버에 서명이 저장되지 않았습니다.");
        return;
      }
    } catch (err) {
      console.error("서명 저장 중 에러 발생:", err);
      alert("서명 저장 중 문제가 발생했습니다.");
      return;
    }

    navigate("/confirm", {
      state: {
        vote: selected,
        tx: signature,
      },
    });
  };

  return (
    <div className="container">
      <h2 className="header">Vote App</h2>
      <div className="vote-list">
        {candidates.map((name, index) => (
          <div
            key={index}
            className={`vote-card ${selected === name ? "selected" : ""}`}
            onClick={() => setSelected(name)}
          >
            {name}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="button" onClick={handleVote}>
          투표하기
        </button>
      </div>
    </div>
  );
};

export default VotePage;
