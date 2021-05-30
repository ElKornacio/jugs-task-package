export default function safeNull<T>(smth: T): NonNullable<T> {
    if (smth === null || typeof smth === 'undefined') {
        throw new Error('Null safety violation');
    }

    return smth as NonNullable<T>;
}