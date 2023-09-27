import axios from "axios";
import { useState } from "react"

export const useRequests = () => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(false);

    async function getRequest(url: string) {
        setLoading(true);

        return await axios({
            method: "get",
            url: url,
        })
            .then((result) => {
                return result.data;
            })
            .catch(() => {
                alert('Erro');
            });
    }

    const postRequest = async (url: string, body: any) => {
        setLoading(true);
        const returnData = await axios({
            method: "post",
            url: url,
            data: body
        }) 
            .then((result) => {
                alert(`O login: ${result.data}`)
                setToken(true);
                return result.data;
            })
            .catch(() => {
                alert("FALHOU")
            })
        console.log(token)
        setLoading(false)
        return returnData
    }

    return {
        loading,
        token,
        getRequest,
        postRequest,
    };
}