import Cookie from 'universal-cookie';

function getCookie() {
    const cookie = new Cookie();
    return cookie;
}

export default getCookie;