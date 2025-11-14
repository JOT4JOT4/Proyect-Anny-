export const responsiveStyle = `
  @media (max-width: 768px) {
    .curriculum-main {
      flex-direction: column !important;
      gap: 0 !important;
    }
    .curriculum-semester {
      flex-direction: row !important;
      min-width: 100% !important;
      margin-bottom: 16px;
      gap: 8px !important;
    }
    .curriculum-cube {
      width: 100% !important;
      min-width: 0 !important;
      margin-bottom: 8px;
    }
    .curriculum-semester-title {
      font-size: 15px !important;
      padding: 4px !important;
    }
  }
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;