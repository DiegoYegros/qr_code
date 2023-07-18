package com.qr.qr_code.Utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.awt.image.BufferedImage;

import javax.imageio.ImageIO;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

public class Utils {
    private Utils() {
    }

    public static final String QR_CODE_IMAGE_PATH = "./src/main/java/QrCodes/QRCode.png";
    public static final String CHARSET = "UTF-8";

    public static InputStream generateQRcode(String data, String charset, Map map, int h, int w)
            throws WriterException, IOException {
        BitMatrix matrix = new MultiFormatWriter().encode(new String(data.getBytes(charset), charset),
                BarcodeFormat.QR_CODE, w, h);

        // Crea la imagen del QR
        BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);

        // Escribe la imagen a un ByteArrayOutputStream
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);

        // Convertir el ByteArrayOutputStream a ByteArrayInputStream
        ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());

        return bais;
    }
}
