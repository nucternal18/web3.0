import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { useState } from "react";

const NavbarItem = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
};

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Image
          src="/logo.png"
          alt="krypt logo"
          width={128}
          height={50}
          className="cursor-pointer"
        />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorials", "Wallets"].map((title, index) => {
          return (
            <NavbarItem
              title={title}
              classProps={"font-bold"}
              key={title + index}
            />
          );
        })}
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          Login
        </li>
      </ul>
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(!toggleMenu)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(!toggleMenu)}
          />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col items-end rounded-mg text-white blue-glassmorphism animate-slide-in">
            <li className="text-xl w-full my-2">
              <AiOutlineClose
                fontSize={28}
                className="text-white md:hidden cursor-pointer"
                onClick={() => setToggleMenu(false)}
              />
            </li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (title, index) => {
                return (
                  <NavbarItem
                    title={title}
                    classProps={"my-2 text-lg"}
                    key={title + index}
                  />
                );
              }
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
