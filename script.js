document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const currentSlideElement = document.getElementById('currentSlide');
    const totalSlidesElement = document.getElementById('totalSlides');
    const progressFill = document.querySelector('.progress-fill');
    
    // Inisialisasi variabel
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Cart system
    let cart = [];
    
    // Update total slides indicator
    totalSlidesElement.textContent = totalSlides;
    
    // Fungsi untuk update slide
    function updateSlide() {
        // Hapus kelas active dari semua slide
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Hapus kelas active dari semua dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Tambah kelas active ke slide dan dot yang sesuai
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Update counter
        currentSlideElement.textContent = currentSlide + 1;
        
        // Update progress bar
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Update tombol navigasi
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        prevBtn.disabled = currentSlide === 0;
        
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    // Event listener untuk tombol next
    nextBtn.addEventListener('click', function() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    });
    
    // Event listener untuk tombol previous
    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    });
    
    // Event listener untuk dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateSlide();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight' || event.key === ' ') {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlide();
            }
        } else if (event.key === 'ArrowLeft') {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlide();
            }
        }
    });
    
    // Inisialisasi pertama kali
    updateSlide();
    
    // Initialize semua sistem
    initializeColorChanger();
    initializeCartSystem();
    initializePaymentSystem();
    initializeCalculator();
    initializeContactForm();
    initializeRestartButton();
});

// Color Changer Function
function initializeColorChanger() {
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
    ];
    
    // Add event listener untuk semua tombol tema
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const slideNumber = this.getAttribute('data-slide');
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Update background untuk slide tertentu
            const heroSlide = document.querySelector(`.hero-slide${slideNumber}`);
            if (heroSlide) {
                heroSlide.style.background = randomColor;
            }
            
            // Animation effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            showNotification('🎨 Tema berhasil diubah!');
        });
    });
}

// Cart System Function
function initializeCartSystem() {
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);
    
    // Event listener untuk tombol tambah ke keranjang
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            addToCart(name, price, image);
            openCart();
            
            // Animation effect
            this.innerHTML = '✅ Ditambahkan';
            this.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
            
            setTimeout(() => {
                this.innerHTML = '🛒 Beli Sekarang';
                this.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)';
            }, 1500);
        });
    });
    
    // Event listener untuk tombol tutup cart
    document.querySelector('.close-cart').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Event listener untuk tombol lanjut belanja
    document.querySelector('.continue-btn').addEventListener('click', closeCart);
    
    // Event listener untuk tombol checkout
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('🛒 Keranjang kosong!');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showNotification(`💳 Checkout berhasil! Total: Rp ${total.toLocaleString('id-ID')}`);
        cart = [];
        updateCartDisplay();
        closeCart();
    });
}

function addToCart(name, price, image) {
    // Cek apakah item sudah ada di keranjang
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`🛒 ${name} ditambahkan ke keranjang!`);
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>Keranjang belanja kosong</p>
                <p>Tambahkan produk untuk melanjutkan</p>
            </div>
        `;
        totalAmount.textContent = 'Rp 0';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">🗑️</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    totalAmount.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Add event listeners untuk tombol di dalam cart
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartDisplay();
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart[index].quantity++;
            updateCartDisplay();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const itemName = cart[index].name;
            cart.splice(index, 1);
            updateCartDisplay();
            showNotification(`🗑️ ${itemName} dihapus dari keranjang`);
        });
    });
}

function openCart() {
    document.querySelector('.cart-panel').classList.add('active');
    document.querySelector('.cart-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.querySelector('.cart-panel').classList.remove('active');
    document.querySelector('.cart-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Payment System Function
function initializePaymentSystem() {
    const paymentModal = document.querySelector('.payment-modal');
    const paymentOverlay = document.querySelector('.payment-overlay');
    const closePaymentBtn = document.querySelector('.close-payment');
    const cancelPaymentBtn = document.querySelector('.cancel-payment');
    const paymentForm = document.getElementById('paymentForm');
    const paymentMethodSelect = document.getElementById('payment-method');
    const bankDetailsDiv = document.getElementById('bank-details');
    
    // Variable untuk menyimpan produk yang sedang dibeli
    let currentProduct = null;
    
    // Event listener untuk semua tombol "Beli Sekarang"
    document.querySelectorAll('.buy-now-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            currentProduct = {
                name: name,
                price: price,
                image: image
            };
            
            openPaymentModal();
            updatePaymentDetails();
        });
    });
    
    function openPaymentModal() {
        if (!currentProduct) return;
        
        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animation effect
        paymentModal.style.opacity = '0';
        setTimeout(() => {
            paymentModal.style.opacity = '1';
        }, 10);
    }
    
    function closePaymentModal() {
        paymentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        currentProduct = null;
        paymentForm.reset();
        bankDetailsDiv.style.display = 'none';
    }
    
    function updatePaymentDetails() {
        if (!currentProduct) return;
        
        document.getElementById('payment-product-name').textContent = currentProduct.name;
        document.getElementById('payment-product-price').textContent = `Rp ${currentProduct.price.toLocaleString('id-ID')}`;
        
        // Update gambar produk
        const productImage = document.querySelector('.payment-product-image');
        productImage.textContent = currentProduct.image;
        
        const subtotal = currentProduct.price;
        const shipping = 15000;
        const total = subtotal + shipping;
        
        document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        document.getElementById('shipping').textContent = `Rp ${shipping.toLocaleString('id-ID')}`;
        document.getElementById('total-payment').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
    
    // Event listener untuk metode pembayaran
    paymentMethodSelect.addEventListener('change', function() {
        if (this.value === 'transfer') {
            bankDetailsDiv.style.display = 'block';
        } else {
            bankDetailsDiv.style.display = 'none';
        }
    });
    
    // Event listener untuk form pembayaran
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('payment-name').value;
        const email = document.getElementById('payment-email').value;
        const phone = document.getElementById('payment-phone').value;
        const method = document.getElementById('payment-method').value;
        
        if (!name || !email || !phone || !method) {
            showNotification('❌ Harap lengkapi semua data pembayaran!');
            return;
        }
        
        if (method === 'transfer') {
            const selectedBank = document.querySelector('input[name="bank"]:checked');
            if (!selectedBank) {
                showNotification('❌ Pilih bank tujuan transfer!');
                return;
            }
        }
        
        // Simulasi proses pembayaran
        showNotification(`✅ Pembayaran berhasil! Order #${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
        
        // Tambahkan ke cart juga
        if (currentProduct) {
            addToCart(currentProduct.name, currentProduct.price, currentProduct.image);
        }
        
        // Reset dan tutup modal
        setTimeout(() => {
            closePaymentModal();
            
            // Simpan data ke localStorage (simulasi)
            const paymentData = {
                product: currentProduct,
                customer: { name, email, phone },
                method: method,
                total: currentProduct.price + 15000,
                timestamp: new Date().toISOString()
            };
            
            let payments = JSON.parse(localStorage.getItem('iraStorePayments') || '[]');
            payments.push(paymentData);
            localStorage.setItem('iraStorePayments', JSON.stringify(payments));
            
            showNotification('📧 Invoice telah dikirim ke email Anda!');
        }, 1500);
    });
    
    // Event listener untuk tombol tutup
    closePaymentBtn.addEventListener('click', closePaymentModal);
    cancelPaymentBtn.addEventListener('click', closePaymentModal);
    paymentOverlay.addEventListener('click', closePaymentModal);
    
    // Close dengan ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
            closePaymentModal();
        }
    });
}

// Calculator Function
function initializeCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const hargaInput = document.getElementById('harga');
    const dpInput = document.getElementById('dp');
    const dpRange = document.getElementById('dpRange');
    const dpValue = document.getElementById('dpValue');
    const tenorSelect = document.getElementById('tenor');
    const resultDiv = document.getElementById('result');

    // Link antara input number dan range
    dpInput.addEventListener('input', function() {
        dpRange.value = this.value;
        dpValue.textContent = `${this.value}%`;
    });
    
    dpRange.addEventListener('input', function() {
        dpInput.value = this.value;
        dpValue.textContent = `${this.value}%`;
    });
    
    // Update initial display
    dpValue.textContent = `${dpInput.value}%`;

    if (calculateBtn && hargaInput && dpInput && tenorSelect && resultDiv) {
        calculateBtn.addEventListener('click', function() {
            const harga = parseFloat(hargaInput.value) || 0;
            const dpPercent = parseFloat(dpInput.value) || 0;
            const tenor = parseInt(tenorSelect.value) || 6;
            
            if (harga <= 0) {
                showNotification('❌ Masukkan harga produk yang valid!');
                return;
            }
            
            // Hitung bunga berdasarkan tenor
            let bungaRate;
            switch(tenor) {
                case 3: bungaRate = 0.01; break; // 1%
                case 6: bungaRate = 0.015; break; // 1.5%
                case 12: bungaRate = 0.02; break; // 2%
                case 24: bungaRate = 0.025; break; // 2.5%
                default: bungaRate = 0.015;
            }
            
            const dpAmount = harga * (dpPercent / 100);
            const sisa = harga - dpAmount;
            const totalBunga = sisa * bungaRate * tenor;
            const totalPembiayaan = sisa + totalBunga;
            const cicilanPerBulan = totalPembiayaan / tenor;
            
            resultDiv.innerHTML = `
                <div class="result-item">
                    <span>Uang Muka:</span>
                    <strong>Rp ${dpAmount.toLocaleString('id-ID')}</strong>
                </div>
                <div class="result-item">
                    <span>Sisa Pinjaman:</span>
                    <strong>Rp ${sisa.toLocaleString('id-ID')}</strong>
                </div>
                <div class="result-item">
                    <span>Total Bunga:</span>
                    <strong>Rp ${totalBunga.toLocaleString('id-ID')}</strong>
                </div>
                <div class="result-item">
                    <span>Total Pembiayaan:</span>
                    <strong>Rp ${totalPembiayaan.toLocaleString('id-ID')}</strong>
                </div>
                <div class="result-item total">
                    <span>Cicilan per Bulan:</span>
                    <strong class="cicilan-bulan">Rp ${cicilanPerBulan.toLocaleString('id-ID')}</strong>
                </div>
            `;
            
            // Animation effect
            resultDiv.style.transform = 'scale(1.05)';
            setTimeout(() => {
                resultDiv.style.transform = 'scale(1)';
            }, 200);
            
            showNotification('✅ Cicilan berhasil dihitung!');
        });
        
        // Hitung otomatis saat input berubah
        [hargaInput, dpInput, tenorSelect].forEach(input => {
            input.addEventListener('input', function() {
                calculateBtn.click();
            });
        });
        
        // Hitung pertama kali
        calculateBtn.click();
    }
    
    // Copy voucher code
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(() => {
                showNotification(`📋 Kode "${code}" disalin ke clipboard!`);
                this.innerHTML = '✅';
                setTimeout(() => {
                    this.innerHTML = '📋';
                }, 2000);
            });
        });
    });
}

// Contact Form Function
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validasi form
            if (!name || !email || !subject || !message) {
                showNotification('❌ Harap isi semua field!');
                return;
            }
            
            // Simulasi pengiriman email
            showNotification('📨 Pesan Anda berhasil dikirim!');
            
            // Reset form
            contactForm.reset();
            
            // Simpan ke localStorage (simulasi)
            const contactData = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            let contacts = JSON.parse(localStorage.getItem('iraStoreContacts') || '[]');
            contacts.push(contactData);
            localStorage.setItem('iraStoreContacts', JSON.stringify(contacts));
            
            // Tambahkan efek visual
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '✅ Terkirim!';
            submitBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
            
            setTimeout(() => {
                submitBtn.innerHTML = '📨 Kirim Pesan';
                submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 3000);
        });
    }
}

// Restart Button Function
function initializeRestartButton() {
    const restartBtn = document.getElementById('restartBtn');
    
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            // Kembali ke slide 1
            currentSlide = 0;
            updateSlide();
            
            // Scroll ke atas
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            showNotification('🔄 Kembali ke halaman awal!');
            
            // Animation effect
            this.innerHTML = '✅ Berhasil!';
            setTimeout(() => {
                this.innerHTML = '🔄 Kembali ke Halaman Awal';
            }, 1500);
        });
    }
}

// Notification Function
function showNotification(message) {
    // Hapus notifikasi lama jika ada
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyle);
