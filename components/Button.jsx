import React from 'react';

const Button = ({ clasStyles, btnName, handleClick }) => (
  <button type="button" onClick={() => handleClick()} className={`nft-gradient text-sm minlg:text-lg px-6 py-2 minlg:px-8 font-poppins font-semibold text-white ${clasStyles}`}>{btnName}</button>
);

export default Button;
