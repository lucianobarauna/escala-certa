import { useState } from "react";

import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import HelloWorld from "./components/HelloWorld/HelloWorld";

const ticks =
  "relative w-full before:absolute before:left-0 before:top-[-4.5px] before:border-[5px] before:border-transparent before:border-l-[var(--border)] before:content-[''] after:absolute after:right-0 after:top-[-4.5px] after:border-[5px] after:border-transparent after:border-r-[var(--border)] after:content-['']";

const navList =
  "mt-8 flex list-none gap-2 p-0 max-lg:mt-5 max-lg:flex-wrap max-lg:justify-center";
const navItem = "max-lg:[flex:1_1_calc(50%-8px)]";
const navLink =
  "flex items-center gap-2 rounded-md bg-[var(--social-bg)] px-3 py-1.5 text-[16px] text-[var(--text-h)] no-underline transition-shadow duration-300 hover:shadow-[var(--shadow)] max-lg:box-border max-lg:w-full max-lg:justify-center";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <HelloWorld name="Vitest" />
      <section className="flex grow flex-col place-content-center place-items-center gap-[25px] max-lg:gap-[18px] max-lg:px-5 max-lg:pt-8 max-lg:pb-6">
        <div className="relative">
          <img
            src={heroImg}
            className="relative inset-x-0 z-0 mx-auto w-[170px]"
            width="170"
            height="179"
            alt=""
          />
          <img
            src={reactLogo}
            className="absolute inset-x-0 top-[34px] z-[1] mx-auto h-[28px] [transform:perspective(2000px)_rotateZ(300deg)_rotateX(44deg)_rotateY(39deg)_scale(1.4)]"
            alt="React logo"
          />
          <img
            src={viteLogo}
            className="absolute inset-x-0 top-[107px] z-0 mx-auto h-[26px] w-auto [transform:perspective(2000px)_rotateZ(300deg)_rotateX(40deg)_rotateY(39deg)_scale(0.8)]"
            alt="Vite logo"
          />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="mb-6 inline-flex rounded-[5px] border-2 border-transparent bg-[var(--accent-bg)] px-2.5 py-[5px] font-mono text-[16px] text-[var(--accent)] transition-colors duration-300 hover:border-[var(--accent-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className={ticks}></div>

      <section className="flex border-t border-[var(--border)] text-left max-lg:flex-col max-lg:text-center">
        <div className="flex-1 border-r border-[var(--border)] p-8 max-lg:border-r-0 max-lg:border-b max-lg:px-5 max-lg:py-6">
          <svg
            className="mb-4 h-[22px] w-[22px]"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul className={navList}>
            <li className={navItem}>
              <a className={navLink} href="https://vite.dev/" target="_blank">
                <img className="h-[18px]" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li className={navItem}>
              <a className={navLink} href="https://react.dev/" target="_blank">
                <img className="h-[18px] w-[18px]" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-1 p-8 max-lg:px-5 max-lg:py-6">
          <svg
            className="mb-4 h-[22px] w-[22px]"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul className={navList}>
            <li className={navItem}>
              <a
                className={navLink}
                href="https://github.com/vitejs/vite"
                target="_blank"
              >
                <svg
                  className="h-[18px] w-[18px] dark:brightness-200 dark:invert"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li className={navItem}>
              <a
                className={navLink}
                href="https://chat.vite.dev/"
                target="_blank"
              >
                <svg
                  className="h-[18px] w-[18px] dark:brightness-200 dark:invert"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li className={navItem}>
              <a
                className={navLink}
                href="https://x.com/vite_js"
                target="_blank"
              >
                <svg
                  className="h-[18px] w-[18px] dark:brightness-200 dark:invert"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li className={navItem}>
              <a
                className={navLink}
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
              >
                <svg
                  className="h-[18px] w-[18px] dark:brightness-200 dark:invert"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className={ticks}></div>
      <section className="h-[88px] border-t border-[var(--border)] max-lg:h-12"></section>
    </>
  );
}

export default App;
