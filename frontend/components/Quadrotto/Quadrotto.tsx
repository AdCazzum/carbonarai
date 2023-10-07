import React, { useEffect, useState } from "react";
import styles from "./quadrotto.module.css";

interface AnswerProps {
  text: string;
  src: string;
  href: string;
}

export const Quadrotto: React.FC<AnswerProps> = ({ text, src, href }) => {
  // const [words, setWords] = useState<string[]>([]);

  return (
    <a target="_blank" href={`${href}`}>
      <div className={styles.aaa}>
        <img style={{ margin: "auto", display: "block", aspectRatio: "1" }} width="60%" src={`${src}`}></img>
        <span style={{ "display": "block", "marginTop": "0.3rem" }}>{text}</span>
      </div>
    </a>
  );
};
