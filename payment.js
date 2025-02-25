// Initialize Three.js background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bgCanvas'),
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create animated background particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x00a8ff
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
camera.position.z = 2;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();

// Payment Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const billingToggle = document.getElementById('billingToggle');
    const pricingSection = document.getElementById('pricingSection');
    const paymentSection = document.getElementById('paymentSection');
    const successSection = document.getElementById('successSection');
    const backToPlans = document.getElementById('backToPlans');
    const paymentForm = document.getElementById('paymentForm');
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    let selectedPlan = null;
    let isYearly = false;

    // Handle billing toggle
    billingToggle.addEventListener('change', () => {
        isYearly = billingToggle.checked;
        updatePrices();
        
        // Animate price changes
        gsap.from('.amount', {
            scale: 0.5,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    });

    // Update prices based on billing period
    function updatePrices() {
        document.querySelectorAll('.amount').forEach(amount => {
            const price = isYearly ? amount.dataset.yearly : amount.dataset.monthly;
            amount.textContent = price;
        });
        
        document.querySelectorAll('.period').forEach(period => {
            period.textContent = isYearly ? '/year' : '/month';
        });
    }

    // Handle plan selection
    document.querySelectorAll('.select-plan-btn').forEach(button => {
        button.addEventListener('click', () => {
            selectedPlan = button.dataset.plan;
            const planPrice = button.closest('.pricing-card').querySelector('.amount').textContent;
            
            // Update payment summary
            document.getElementById('selectedPlan').textContent = 
                `${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`;
            document.getElementById('planPrice').textContent = 
                `$${planPrice}${isYearly ? '/year' : '/month'}`;
            document.getElementById('totalAmount').textContent = `$${planPrice}`;

            // Animate transition to payment section
            gsap.timeline()
                .to(pricingSection, {
                    opacity: 0,
                    y: -50,
                    duration: 0.5
                })
                .set(pricingSection, { display: 'none' })
                .set(paymentSection, { display: 'block' })
                .from(paymentSection, {
                    opacity: 0,
                    y: 50,
                    duration: 0.5
                });
        });
    });

    // Handle payment method selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            gsap.from(option, {
                scale: 0.9,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });
    });

    // Handle form submission
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = paymentForm.querySelector('button[type="submit"]');
        
        // Validate form
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        if (!validatePaymentForm(cardNumber, expiryDate, cvv, cardName)) {
            showError('Please fill in all payment details correctly');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            // Process payment
            const paymentData = {
                plan: selectedPlan,
                isYearly,
                cardNumber,
                expiryDate,
                cvv,
                cardName
            };

            const response = await processPayment(paymentData);

            if (response.success) {
                // Show success animation
                gsap.timeline()
                    .to(paymentSection, {
                        opacity: 0,
                        y: -50,
                        duration: 0.5
                    })
                    .set(paymentSection, { display: 'none' })
                    .set(successSection, { display: 'block' })
                    .from(successSection, {
                        opacity: 0,
                        y: 50,
                        duration: 0.5
                    })
                    .from('.success-icon', {
                        scale: 0,
                        rotation: 180,
                        duration: 0.5
                    });
            }
        } catch (error) {
            showError('Payment failed. Please try again.');
            submitButton.disabled = false;
            submitButton.innerHTML = '<span>Pay Now</span><i class="fas fa-lock"></i>';
        }
    });

    // Back button functionality
    backToPlans.addEventListener('click', () => {
        gsap.timeline()
            .to(paymentSection, {
                opacity: 0,
                y: 50,
                duration: 0.5
            })
            .set(paymentSection, { display: 'none' })
            .set(pricingSection, { display: 'block' })
            .from(pricingSection, {
                opacity: 0,
                y: -50,
                duration: 0.5
            });
    });
});

// Validation functions
function validatePaymentForm(cardNumber, expiryDate, cvv, cardName) {
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const cvvRegex = /^[0-9]{3,4}$/;

    return (
        cardNumberRegex.test(cardNumber.replace(/\s/g, '')) &&
        expiryDateRegex.test(expiryDate) &&
        cvvRegex.test(cvv) &&
        cardName.trim().length > 0
    );
}

// Error notification
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    gsap.timeline()
        .from(notification, {
            y: 50,
            opacity: 0,
            duration: 0.3
        })
        .to(notification, {
            y: 50,
            opacity: 0,
            duration: 0.3,
            delay: 3,
            onComplete: () => notification.remove()
        });
}

// Payment processing function (to be connected with backend)
async function processPayment(paymentData) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 2000);
    });
}