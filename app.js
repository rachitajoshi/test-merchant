const bitpayButton = document.getElementById('bitpayButton');

bitpayButton.addEventListener('click', generateInvoice);

async function generateInvoice(event) {
    event.preventDefault();
    const price = document.getElementById('invoicePrice').value;
    const redirectURL = 'https://justinkook.github.io/bitpayTestMerchant';
    const invoice = {
        currency: 'USD',
        price,
        token: 'Hfys1u5Hy3DXLk4MoEwxayiSdfx62QQf4PDpVCrNc1sX',
        itemDesc: `Johnathan's Kookies`,
        orderId: '10742',
        redirectURL
    };
    const authHeaders = {
        headers: {
            'Content-Type': 'application/json',
            'x-accept-version': '2.0.0'
        }
    };
    try {
        const { data } = await axios.post('https://testinvoice.b-pay.net/invoice', invoice, authHeaders);
        const id = data["id"];
        showInvoice(id);
    } catch (err) {
        console.log(err);
    }
};

function showSnackbar(status) {
    const snackbar = document.getElementById('snackbar');
    // Add the 'show' class to DIV
    snackbar.className = `${status} show`;
    snackbar.innerText = `${status}`;
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        snackbar.className = snackbar.className.replace(`${status} show`, '');
    }, 3000);
}

function showInvoice(id) {
    let is_paid = false
    window.addEventListener("message", function (event) {
        payment_status = event.data.status;
        if (payment_status == "paid") {
            is_paid = true
            showSnackbar('success');
            //take action PAID
            return;
        }
    }, false);
    //show the order info
    bitpay.onModalWillLeave(function () {
        if (is_paid == false) {
            showSnackbar('fail');
            //take action, NOT PAID
        } //endif
    });
    //show the modal
    bitpay.setApiUrlPrefix('https://staging.bitpay.com');
    bitpay.showInvoice(id);
}
