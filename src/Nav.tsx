import React, { useEffect, useRef, useState } from "react";
import { Pages } from "./constants";
import "./Nav.css";

function Nav({
  page,
  setPage,
  isMobile,
}: {
  page: Pages;
  setPage: React.Dispatch<React.SetStateAction<Pages>>;
  isMobile: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        event.target &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  return isMobile ? (
    <header className="mobile-header">
      <div className="logo">Songzy</div>
      <div className="hamburger-container" ref={menuRef}>
        <button onClick={toggleMenu} style={{ alignSelf: "flex-end" }}>
          <span>{isMenuOpen ? "X" : "☰"}</span>
        </button>
        {isMenuOpen && (
          <div className="hamburger-menu">
            {Object.values(Pages).map((pageName) => (
              <button
                key={pageName}
                className={page === pageName ? "selected" : ""}
                onClick={() => {
                  ``;
                  if (page !== pageName) {
                    setPage(pageName);
                    setIsMenuOpen(false);
                  }
                }}
              >
                {pageName}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  ) : (
    <div className="">
      <header>
        <span className="logo">Songzy</span>
      </header>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        {Object.values(Pages).map((pageName) => (
          <button
            key={pageName}
            className={page === pageName ? "selected" : ""}
            onClick={() => {
              ``;
              if (page !== pageName) {
                setPage(pageName);
              }
            }}
          >
            {pageName}
          </button>
        ))}
      </nav>
    </div>
    // <div className="sidebar">
    //   <div className="menu sidebar-menu">
    //     <a href="#">Home</a>
    //     <a href="#">About</a>
    //     <a href="#">Contact</a>
    //   </div>
    // </div>
  );
}

export default Nav;
