---
title: "Network Forensics: Tshark Payload Extraction"
description: "Menganalisis dan mengekstraksi payload berbahaya dari file PCAP menggunakan Tshark pada environment Arch Linux."
date: "2026-05-06"
tags: ["Forensics", "picoCTF", "Tshark", "Blue-Team"]
---

Sebagian besar tantangan forensik jaringan (Network Forensics) tidak membutuhkan GUI seperti Wireshark jika kamu sudah memahami struktur paket. Menggunakan `tshark` mempercepat alur kerja, terutama ketika berhadapan dengan file PCAP berukuran masif.

## Skenario

Kita mendapatkan file `capture.pcapng` dari sebuah insiden _malware beaconing_. Analisis awal menunjukkan adanya komunikasi HTTP yang mencurigakan ke port 8080. Tugas kita adalah mengekstraksi file yang diunduh oleh _malware_ tersebut.

## Eksekusi Tshark

Alih-alih membuang waktu melakukan _scrolling_ di Wireshark, kita memfilter paket HTTP GET langsung dari terminal:

```bash
tshark -r capture.pcapng -Y "http.request.method == GET" -T fields -e http.request.uri
```

Setelah menemukan URI yang mencurigakan (misalnya `/payload.bin`), kita isolasi _stream_ TCP-nya dan ekstrak objek HTTP-nya ke dalam direktori lokal:

```bash
tshark -r capture.pcapng -q -z http,tree --export-objects http,./extracted_files
```

## Analisis Artefak

File `payload.bin` berhasil diekstrak. Langkah selanjutnya adalah memeriksa _hash_ dan tipe file menggunakan utilitas dasar Linux:

1. `file payload.bin` (Mengecek _magic bytes_)
2. `sha256sum payload.bin` (Mendapatkan _hash_ untuk cross-reference di VirusTotal)
3. `strings payload.bin | grep -i "flag"` (Mencari _plaintext_ yang mungkin tertinggal)

Mengotomatiskan alur ekstraksi ini adalah kunci dalam operasi _Blue Team_ yang efisien.
