/* eslint-disable @typescript-eslint/no-explicit-any */
const getBrowser = () => {
    const { userAgent } = window.navigator;

    let browser_name = '';
    const isIE = /*@cc_on!@*/ false || !!(document as any).documentMode;
    const isEdge = !isIE && !!(window as any).StyleMedia;
    if (userAgent.indexOf('Chrome') !== -1 && !isEdge) {
        browser_name = 'Chrome';
    } else if (userAgent.indexOf('Safari') !== -1 && !isEdge) {
        browser_name = 'Safari';
    } else if (userAgent.indexOf('Firefox') !== -1) {
        browser_name = 'Firefox';
    } else if (
        userAgent.indexOf('MSIE') !== -1 ||
        !!(document as any).documentMode === true
    ) {
        //IF IE > 10
        browser_name = 'IE';
    } else if (isEdge) {
        browser_name = 'Edge';
    } else {
        browser_name = 'Unknown';
    }

    return browser_name;
};

const getOSName = () => {
    const { userAgent } = window.navigator;

    let OSName = 'Unknown';
    if (userAgent.indexOf('Windows NT 10.0') !== -1) OSName = 'Windows 10';
    if (userAgent.indexOf('Windows NT 6.2') !== -1) OSName = 'Windows 8';
    if (userAgent.indexOf('Windows NT 6.1') !== -1) OSName = 'Windows 7';
    if (userAgent.indexOf('Windows NT 6.0') !== -1) OSName = 'Windows Vista';
    if (userAgent.indexOf('Windows NT 5.1') !== -1) OSName = 'Windows XP';
    if (userAgent.indexOf('Windows NT 5.0') !== -1) OSName = 'Windows 2000';
    if (userAgent.indexOf('Mac') !== -1) OSName = 'Mac/iOS';
    if (userAgent.indexOf('X11') !== -1) OSName = 'UNIX';
    if (userAgent.indexOf('Linux') !== -1) OSName = 'Linux';

    return OSName;
};
export const TdLibParams = {
    // get from https://my.telegram.org/auth
    apiId: 'your apiId',
    apiHash: 'your apiHash',
    jsLogVerbosityLevel: 'info',
    logVerbosityLevel: 2,
    deviceModel: getBrowser(),
    systemVersion: getOSName(),
};

export enum AuthorizationState {
    WaitPhoneNumber = 'authorizationStateWaitPhoneNumber',
    WaitEmailAddress = 'authorizationStateWaitEmailAddress',
    WaitEmailCode = 'authorizationStateWaitEmailCode',
    WaitCode = 'authorizationStateWaitCode',
    WaitRegistration = 'authorizationStateWaitRegistration',
    WaitPassword = 'authorizationStateWaitPassword',
    WaitOtherDeviceConfirmation = 'authorizationStateWaitOtherDeviceConfirmation',
    Ready = 'authorizationStateReady',
}

export const MESSAGE_UNSUPPORTED_URL =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK6QnSm5CijtNEYZihu-STPwT0oKuy5WOQRg&usqp=CAU';
export const MESSAGE_UNKNOWN_URL =
    'https://i.ytimg.com/vi/W8MLveDVfSo/mqdefault.jpg';

export const CHAT_MAX_MEDIA = 150;
export const CHAT_FILTER = 'searchMessagesFilterPhoto';
export const BASE_PRIORITY = 2;
export const CHAT_SUPPORTED_MEDIA = [
    'messageUnsupported',
    'messagePhoto',
    'messageVideo',
    'messageVideoNote',
];
