package com.qr.qr_code.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.qr.qr_code.Utils.Utils;
import com.qr.qr_code.dto.RequestDTO;

@RestController
@RequestMapping("/qr")
public class QrController {

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping
    public @ResponseBody ResponseEntity<byte[]> getQr(@RequestBody RequestDTO request) {
        if (request == null || request.getText() == null || request.getText().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Map<EncodeHintType, ErrorCorrectionLevel> hashMap = new HashMap<>();
        hashMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        InputStream in;
        try {
            in = Utils.generateQRcode(request.getText(), Utils.CHARSET, hashMap, 200, 200);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        try {
            return ResponseEntity.ok(org.apache.commons.io.IOUtils.toByteArray(in));
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
