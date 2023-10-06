import { IconExternalLink } from "@tabler/icons-react";
import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[60px] border-b border-gray-300 py-2 px-8 items-center justify-between">
      <div className="font-bold text-2xl flex items-center">
        <a
          className="hover:opacity-50"
          href="/"
        >
          <div className="inline-flex items-center">
            CarbonarAI 🍝
          </div>
        </a>
      </div>
      <div>
        <a
          className="flex items-center hover:opacity-50"
          href="https://github.com/slavni96/carbonarai"
          target="_blank"
          rel="noreferrer"
        >
          <img src={`https://ethrome.org/ethrome_logo.png`} style={{ height: "3rem" }} />
        </a>
      </div>
    </div>
  );
};
