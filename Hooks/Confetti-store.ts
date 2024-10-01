import  {create} from "zustand"

interface confettininterface {
    isOpen :boolean
    onOpen:()=>void
    onClose:()=>void
}

export const useConfetti = create<confettininterface>((set)=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))