import { ChangeEvent, useState, useEffect, FunctionComponent } from 'react';
import axios from 'axios';
 
const InputText: FunctionComponent = () => {
    const [input, setInput] = useState<string>('');
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [pendingQrImage, setPendingQrImage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const getQR = async (input: string) => {
        if (input.length === 0) {
            setQrImage(null);
            setErrorMessage('El texto no puede estar vacío.');
            return;
        }
        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:8080/qr',
                data: {
                    text: input,
                },
                responseType: 'arraybuffer'
            });

            const u8 = new Uint8Array(response.data);
            const b64 = btoa(u8.reduce((prev, curr) => prev + String.fromCharCode(curr), ''));
            setPendingQrImage(`data:image/png;base64,${b64}`);
            setErrorMessage(null); // clear error message upon successful request
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('Ha ocurrido un error al generar el código QR.');
            } else {
                setErrorMessage('Ha ocurrido un error desconocido.');
            }
            setQrImage(null);
        }
    };

    const downloadImage = () => {
        if (qrImage) {
            const link = document.createElement('a');
            link.href = qrImage;
            link.download = 'QR_'+input+'.png';
            link.click();
        }
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        getQR(input);
    };

    useEffect(() => {
        setQrImage(pendingQrImage);
    }, [pendingQrImage]);

    return (
        <div className='flex justify-between items-start items-center'>
            <form onSubmit={onSubmit} className="w-1/2 flex items-center flex-col">
                <h2 className='mb-8'>What should your QR say?</h2>
                <input className="text-center"type="text" value={input} onChange={onChange}/>
                <button className="mx-2 my-3"type="submit">Submit</button>
            </form>
            <div className='w-1/2 flex flex-col items-center'>
                {qrImage ? 
                    <>
                        <img className="border border-3 border-gray-300 rounded-lg content-center ml-20 mr-20 mx-auto my-6 flex-auto" src={qrImage} alt="Generated QR Code" />
                        <button className="content-center flex-auto my-8" onClick={downloadImage}>Download QR</button>
                    </>
                    :
                    <div className=" border-gray-300 rounded-lg content-center text-center my-12 flex-auto">
                        {errorMessage ? 
                            <h3 className="border-gray-300 text-center content-center ml-20 mr-20">{errorMessage}</h3> : null}
                    </div>
                }
            </div>
        </div>
    );
};

export default InputText;
