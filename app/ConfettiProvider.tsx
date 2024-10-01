
"use client"
import { useConfetti } from "@/Hooks/Confetti-store";
import ReactConfetti from "react-confetti";

const ConfettiProvider = () => {
  const confeti = useConfetti((state) => state);
  if(!confeti.isOpen) return null
  return (
    <ReactConfetti
      width={window.innerWidth}
      recycle={false}
      className=" pointer-events-none z-[100] "
      numberOfPieces={200 }
      onConfettiComplete={() => {
        confeti.onClose();
      }}
    />
  );
};

export default ConfettiProvider;
