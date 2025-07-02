// script.js - Handles all interactive behavior and animations for Total Trust Loan Solutions

// Custom smooth scroll with ease-in-out
function smoothScrollTo(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  const targetY = el.getBoundingClientRect().top + window.pageYOffset;
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const duration = Math.min(900, Math.max(400, Math.abs(distance) * 0.7)); // ms, based on distance
  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animateScroll(currentTime) {
    if (!startTime) startTime = currentTime;
    const time = Math.min(1, (currentTime - startTime) / duration);
    const eased = easeInOutQuad(time);
    window.scrollTo(0, startY + distance * eased);
    if (time < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  requestAnimationFrame(animateScroll);
}

// Fade-in/slide-up on scroll for sections
function animateOnScroll() {
  const animatedSections = document.querySelectorAll('[data-animate]');
  const observer = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
      } else {
        entry.target.classList.remove('opacity-100', 'translate-y-0');
        entry.target.classList.add('opacity-0', 'translate-y-8');
      }
    });
  }, { threshold: 0.1 });
  animatedSections.forEach(section => {
    section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
    observer.observe(section);
  });
}

// Button and card hover effects (scaling/shadow)
function addHoverEffects() {
  document.querySelectorAll('.hover-animate-tile').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.classList.add('scale-105', 'shadow-2xl');
    });
    el.addEventListener('mouseleave', () => {
      el.classList.remove('scale-105', 'shadow-2xl');
    });
  });
}

// Loan Calculator: Reveal results and scroll
function setupLoanCalculator() {
  const form = document.getElementById('loanForm');
  const results = document.getElementById('results');
  if (!form || !results) return;
  const emiEl = document.getElementById('emi');
  const totalEl = document.getElementById('total');
  const interestEl = document.getElementById('interest');
  const resetBtn = document.getElementById('resetBtn');
  const tenureType = document.getElementById('tenureType');

  function formatINR(num) {
    return '₹' + Number(num).toLocaleString('en-IN', {maximumFractionDigits: 2});
  }
  function calculateEMI(P, r, n) {
    if (r === 0) return P / n;
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return emi;
  }
  function showResults(emi, total, interest) {
    emiEl.textContent = formatINR(emi);
    totalEl.textContent = formatINR(total);
    interestEl.textContent = formatINR(interest);
    results.classList.remove('hidden');
    setTimeout(() => results.classList.add('opacity-100', 'translate-y-0'), 10);
    results.classList.remove('opacity-0', 'translate-y-8');
    // Custom smooth scroll to results
    smoothScrollTo(results);
  }
  function hideResults() {
    results.classList.remove('opacity-100', 'translate-y-0');
    results.classList.add('opacity-0', 'translate-y-8');
    setTimeout(() => results.classList.add('hidden'), 500);
  }
  function validateInputs(amount, rate, tenure) {
    if (amount < 1000 || amount > 1000000) return false;
    if (rate < 1 || rate > 36) return false;
    if (tenure < 1 || tenure > 120) return false;
    return true;
  }
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(form.amount.value);
    const rate = parseFloat(form.rate.value);
    let tenure = parseInt(form.tenure.value, 10);
    if (tenureType.value === 'years') tenure *= 12;
    if (!validateInputs(amount, rate, tenure)) {
      hideResults();
      return;
    }
    const monthlyRate = rate / 12 / 100;
    const emi = calculateEMI(amount, monthlyRate, tenure);
    const total = emi * tenure;
    const interest = total - amount;
    showResults(emi, total, interest);
  });
  // Only show results on submit, not on input
  form.addEventListener('input', function() {
    hideResults();
  });
  resetBtn.addEventListener('click', function() {
    form.reset();
    hideResults();
  });
}

// Smooth scroll for eligibility button
function setupEligibilityScroll() {
  document.querySelectorAll('[data-scroll-to-eligibility]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      smoothScrollTo('#eligibility');
    });
  });
}

// FAQ Accordion logic
function setupFAQAccordion() {
  const faqs = [
    {
      q: "How fast can I get a payday loan approved?",
      a: "Most applications are approved within minutes. Once approved, funds are typically disbursed within a few hours to your bank account."
    },
    {
      q: "What is the maximum loan amount I can get?",
      a: "You can get payday loans up to ₹50,000, depending on your eligibility and lender policies."
    },
    {
      q: "What documents do I need to apply?",
      a: "Usually, you need a valid government ID (like Aadhaar or PAN), proof of income (salary slip or bank statement), and proof of address."
    },
    {
      q: "What are the interest rates for payday loans?",
      a: "Interest rates vary by lender, but typically range from 1% to 3% per month. Always check the exact rate before accepting a loan offer."
    },
    {
      q: "Who is eligible for a payday loan?",
      a: "Salaried individuals aged 21-60 with a regular monthly income and an active bank account are generally eligible."
    },
    {
      q: "Will applying for a payday loan affect my credit score?",
      a: "Most lenders do a soft credit check, which does not impact your credit score. However, late payments or defaults can affect your score."
    },
    {
      q: "Can I repay my loan early?",
      a: "Yes, most lenders allow early repayment. Some may charge a small prepayment fee, so check with your lender."
    },
    {
      q: "What happens if I miss a repayment?",
      a: "Missing a repayment can result in late fees, higher interest, and a negative impact on your credit score. Always try to pay on time."
    },
    {
      q: "Is my personal information safe?",
      a: "Reputable lenders use secure, encrypted systems to protect your data. Always check for privacy policies and secure website indicators (https)." 
    },
    {
      q: "Can self-employed individuals apply for payday loans?",
      a: "Some lenders do offer payday loans to self-employed individuals, but you may need to provide additional proof of income and business activity."
    }
  ];
  const faqContainer = document.getElementById('faq');
  if (!faqContainer) return;
  faqContainer.innerHTML = '';
  faqs.forEach((item, idx) => {
    const faqId = `faq-item-${idx}`;
    faqContainer.insertAdjacentHTML('beforeend', `
      <div class="border border-[#a62d3c]/30 rounded-lg overflow-hidden">
        <button type="button" aria-expanded="false" aria-controls="${faqId}" class="w-full flex justify-between items-center px-6 py-4 bg-[#f7f0e7] text-lg font-semibold text-left focus:outline-none transition">
          <span>${item.q}</span>
          <svg class="w-6 h-6 ml-2 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div id="${faqId}" class="max-h-0 overflow-hidden bg-white px-6 transition-all duration-300 text-base text-[#333]">
          <div class="py-4">${item.a}</div>
        </div>
      </div>
    `);
  });
  // Accordion toggle logic
  faqContainer.querySelectorAll('button').forEach((btn, idx) => {
    btn.addEventListener('click', function() {
      const content = document.getElementById(`faq-item-${idx}`);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      // Collapse all others
      faqContainer.querySelectorAll('div[id^="faq-item-"]').forEach((el, i) => {
        if (i !== idx) {
          el.style.maxHeight = null;
          faqContainer.querySelectorAll('button')[i].setAttribute('aria-expanded', false);
          faqContainer.querySelectorAll('svg')[i].classList.remove('rotate-180');
        }
      });
      // Toggle this one
      if (!expanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
        btn.querySelector('svg').classList.add('rotate-180');
      } else {
        content.style.maxHeight = null;
        btn.querySelector('svg').classList.remove('rotate-180');
      }
    });
  });
}

// Show/hide 'Other' fields for Purpose and Employment Type
function setupOtherFields() {
  // Support both contact.html and about.html
  const purpose = document.getElementById('purpose');
  const purposeOther = document.getElementById('purpose-other');
  const employment = document.getElementById('employment');
  const employmentOther = document.getElementById('employment-other');
  const form = document.getElementById('contact-form');

  if (purpose && purposeOther) {
    purpose.addEventListener('change', function () {
      if (purpose.value === 'Other') {
        purposeOther.classList.remove('hidden');
        purposeOther.required = true;
      } else {
        purposeOther.classList.add('hidden');
        purposeOther.required = false;
        purposeOther.value = '';
      }
    });
  }
  if (employment && employmentOther) {
    employment.addEventListener('change', function () {
      if (employment.value === 'Other') {
        employmentOther.classList.remove('hidden');
        employmentOther.required = true;
      } else {
        employmentOther.classList.add('hidden');
        employmentOther.required = false;
        employmentOther.value = '';
      }
    });
  }
  // On form submit, if the Other fields are hidden, clear their values
  if (form) {
    form.addEventListener('submit', function () {
      if (purposeOther && purposeOther.classList.contains('hidden')) {
        purposeOther.value = '';
      }
      if (employmentOther && employmentOther.classList.contains('hidden')) {
        employmentOther.value = '';
      }
    });
  }
}

// On DOM ready
window.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
  addHoverEffects();
  setupLoanCalculator();
  setupEligibilityScroll();
  setupFAQAccordion();
  setupOtherFields();
}); 