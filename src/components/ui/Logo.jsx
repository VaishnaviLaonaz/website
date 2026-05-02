// // src/components/Logo.jsx
// import React from 'react';

// /**
//  * A reusable LAONAZ logo component.
//  * Renders the text with the exact font metrics and color from Figma.
//  */
// const Logo = () => (
//   <span style={logoStyle}>
//     LAONAZ
//   </span>
// );

// const logoStyle = {
//   fontFamily: "'Poppins', sans-serif",
//   fontWeight: 300,
//   fontSize: '30px',
//   lineHeight: '36px',       // 120% of 30px
//   letterSpacing: '1.5px',   // 5% of 30px
//   verticalAlign: 'middle',
//   color: '#5C6B3C',
// };

// export default Logo;


// src/components/Logo.jsx
import React from 'react';

/**
 * A reusable LAONAZ logo component.
 * Renders the text with the exact font metrics and color from Figma,
 * constrained to 120×36 pixels.
 */
const Logo = ({ className = "" }) => (
  <div className={`logo-wrapper ${className}`} style={wrapperStyle}>
    <span style={logoStyle}>LAONAZ</span>
  </div>
);

const wrapperStyle = {
  width: "130px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const logoStyle = {
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 300,
  fontSize: "30px",        // keeps the text around 30px tall
  lineHeight: "36px",      // aligns with the wrapper height
  letterSpacing: "1.5px",    // 5% of 30px
  color: "#5C6B3C",
  whiteSpace: "nowrap",
};

export default Logo;
