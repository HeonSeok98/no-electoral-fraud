import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const ConfirmPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000); // 5초 후 홈으로 이동

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container">
      <h2 className="header">Vote App</h2>
      <div className="confirm-content">
        <div className="check-icon">✅</div>
        <h1>투표가 완료되었습니다!</h1>
        <p>잠시 후 메인 화면으로 돌아갑니다...</p>
      </div>
    </div>
  );
};

export default ConfirmPage;
