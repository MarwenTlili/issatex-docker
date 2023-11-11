import dynamic from "next/dynamic"
import { Dispatch, SetStateAction, useMemo } from "react"
import 'react-quill/dist/quill.snow.css'

type props = {
    data: string | undefined
    setData: Dispatch<SetStateAction<string | undefined>>
}

const RichTextEditor = ({ data, setData }: props) => {
    /** 
     * dynamic import With no SSR
     * 
     * Dynamically load a component on the client side, you can use the ssr option to disable server-rendering.
     * 
     * Useful if an external dependency or component relies on browser APIs like window.
     */
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), [])

    return <div>
        <ReactQuill
            theme="snow"
            value={data}
            onChange={setData}
        />
    </div>
};

export default RichTextEditor
