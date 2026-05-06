---
title: "Provisioning Azure VMSS dengan Terraform"
description: "Otomatisasi Virtual Machine Scale Sets (VMSS) menggunakan Terraform untuk elastisitas infrastruktur dan integrasi VictoriaMetrics."
date: "2026-05-06"
tags: ["Terraform", "Azure", "VMSS", "IaC"]
---

Infrastruktur statis adalah utang teknis (_technical debt_). Saat beban sistem meningkat, infrastruktur harus mampu melakukan _scale-out_ secara otonom, dan melakukan _scale-in_ saat beban menurun untuk efisiensi biaya.

## Konfigurasi VMSS

Kita menggunakan Terraform untuk mendefinisikan _Virtual Machine Scale Sets_ (VMSS) di Azure. Modul ini memastikan bahwa setiap instans baru yang lahir akan mendapatkan identitas yang sama.

```hcl
resource "azurerm_linux_virtual_machine_scale_set" "app_vmss" {
  name                = "app-vmss-production"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard_B2s"
  instances           = 2
  admin_username      = "adminuser"

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    storage_account_type = "StandardSSD_LRS"
    caching              = "ReadWrite"
  }
}
```

## Injeksi Telemetri via Cloud-init

Masalah terbesar dari VMSS adalah instans bersifat sementara (_ephemeral_). Mengonfigurasi pemantauan secara manual adalah hal yang mustahil. Kita menggunakan `cloud-init` untuk menyuntikkan _Node Exporter_ secara otomatis saat VM melakukan proses _booting_.

Metrik kemudian ditarik (di-_scrape_) oleh tumpukan **Prometheus dan VictoriaMetrics** kita yang berada di klaster _observability_ terpusat, memastikan kita tidak pernah kehilangan visibilitas meskipun VM dihancurkan oleh _autoscaler_.
