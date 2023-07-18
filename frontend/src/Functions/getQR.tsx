function getQR(input: string){
    axios({
        method: 'post',
        url: 'http://localhost:8080/qr',
        data: {
          text: input,
        },
        responseType: 'arraybuffer'
      });
    const u8 = new Uint8Array(response.data);
    const b64 = btoa(u8.reduce((prev, curr) => prev + String.fromCharCode(curr), ''));
    return `data:image/png;base64,${b64}`
}
export defualt getQR;