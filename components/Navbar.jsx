/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '.';
import { NFTContext } from '../context/NFTContext';

import images from '../assets';

const MenuItems = ({ isMobile, active, setActive, setIsOpen }) => {
  const generateLink = (menuItem) => {
    switch (menuItem) {
      case 'Explore NFTs':
        return '/';
      case 'Listed NFTs':
        return '/listed-nfts';
      case 'My NFTs':
        return '/my-nfts';

      default:
        return '/';
    }
  };

  const menuItems = ['Explore NFTs', 'Listed NFTs', 'My NFTs'];

  // Functionality to generate dynamic links for menu items
  return (
    <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>

      {
        menuItems.map((item, i) => (
          <li key={i} onClick={() => { if (isMobile) { setActive(item); setIsOpen(false); } else { setActive(active); } }} className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white  hover:text-nft-dark mx-3 ${isMobile ? 'p-5' : ''} ${active === item ? 'dark:text-white text-nft-black-1' : 'dark:text-nft-gray-3 text-nft-black-2'}`}>
            <Link href={generateLink(menuItems[i])}>{item}</Link>
          </li>
        ))
}

    </ul>
  );
};

const ButtonGroup = ({ setActive, router, setIsOpen, isMobile }) => {
  const { connectWallet, currentAccount } = useContext(NFTContext);

  return currentAccount ? (
    <Button btnName="Create" clasStyles="mx-2 rounded-xl" handleClick={() => { setActive(' '); router.push('/create-nft'); if (isMobile)setIsOpen(false); }} />
  ) : <Button btnName="Connect" clasStyles="mx-2 rounded-xl" handleClick={connectWallet} />;
};

// const checkActive = (active, setActive, router) => {
//   switch (router.pathName) {
//     case '/':
//       if (active !== 'Explore NFTs') setActive('Explore NFTs');
//       break;

//     case '/listed-nfts':
//       if (active !== 'Listed NFTs') setActive('Listed NFTs');
//       break;

//     case '/my-nfts':
//       if (active !== 'My NFTs') setActive('My NFTs');
//       break;

//     case '/create-nft':
//       if (active !== '') setActive('');
//       break;

//     default:
//       setActive('');
//   }
// };

const checkActive = (active, setActive, router) => {
  switch (router.pathname) {
    case '/':
      if (active !== 'Explore NFTs') setActive('Explore NFTs');
      break;
    case '/listed-nfts':
      if (active !== 'Listed NFTs') setActive('Listed NFTs');
      break;
    case '/my-nfts':
      if (active !== 'My NFTs') setActive('My NFTs');
      break;
    case '/create-nft':
      if (active !== '') setActive('');
      break;
    default:
      setActive('');
  }
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState('Explore NFTs');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkActive(active, setActive, router);
  }, [router.pathname]);

  useEffect(() => {
    setTheme('dark');
  }, []);

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div className="flexCenter md:hidden cursor-pointer" onClick={() => setActive('Explore NFTs')}>
            <Image src={images.logo02} objectFit="contain" width={32} height={32} alt="logo" />
            <p className=" dark:text-white text-nft-black-1 font-semibold text-lg ml-1">MetaKraft</p>
          </div>
        </Link>
        <Link href="/">
          <div
            className="hidden md:flex"
            onClick={() => {
              setActive('Explore NFTs');
              setIsOpen(false);
            }}
          >
            <Image src={images.logo02} objectFit="contain" width={32} height={32} alt="logo" />
          </div>
        </Link>
      </div>

      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label mx-4">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>
        <div className="md:hidden flex">
          <MenuItems active={active} setActive={setActive} />
          <div className="ml-4">
            <ButtonGroup setActive={setActive} router={router} />
          </div>
        </div>
      </div>

      <div className="hidden md:flex ml-2 ">

        {isOpen ? (
          <Image src={images.cross} objectFit="contain" width={20} height={20} alt="menu" onClick={() => setIsOpen(false)} className={theme === 'light' && 'filter invert'} />
        ) : <Image src={images.menu} objectFit="contain" width={25} height={25} alt="menu" onClick={() => setIsOpen(true)} className={theme === 'light' && 'filter invert'} />}

        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems active={active} setActive={setActive} isMobile setIsOpen={setIsOpen} />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray">
              <ButtonGroup setActive={setActive} router={router} setIsOpen={setIsOpen} isMobile />
            </div>
          </div>
        )}

      </div>

    </nav>
  );
};

export default Navbar;
