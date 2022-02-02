import { useEffect, useRef, useContext } from "react";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
import { WalletContext } from 'context/WalletContext'

const Icon = styled.div`
  margin: 0 0 0 16px;
  width: 24px;
  height: 24px;
  border-radius: 100%;
`;

export default function Identicon() {
  const ref = useRef<HTMLDivElement>();
  // const { account } = useEthers();

  const { wallet } = useContext(WalletContext)

  useEffect(() => {
    if (wallet && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(24, parseInt(wallet?.address?.slice(2, 10), 16)));
    }
  }, [wallet]);

  return <Icon ref={ref as any} />;
}
