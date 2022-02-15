import { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
import useWallet from 'hooks/useWallet'

const Icon = styled.div`
  margin: 0 0 0 16px;
  width: 24px;
  height: 24px;
  border-radius: 100%;
`;

export default function Identicon() {
  const ref = useRef<HTMLDivElement>();
  const { address } = useWallet()

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(24, parseInt(address?.slice(2, 10), 16)));
    }
  }, [address]);

  return <Icon ref={ref as any} />;
}
