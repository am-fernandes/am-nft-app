import { useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";

const Icon = styled.div`
  margin: 0 0 0 16px;
  width: 24px;
  height: 24px;
  border-radius: 100%;
`;

export default function Identicon() {
  const ref = useRef<HTMLDivElement>();
  const { account } = useEthers();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(24, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return <Icon ref={ref as any} />;
}
