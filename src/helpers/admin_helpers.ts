export const buttonClass = (btn: string, mode: string) =>
    btn == mode ? "btn-secondary" : "btn-outline-secondary";
export const disabled = (val: any) => val == "ID" ? "disabled" : "";
export const selected = (val1: any, val2: any) => val1 == val2 ? "selected" : "";
export const first = (index: number) => index == 0;
export const total = (sels: any[]) =>
    (sels ?? []).reduce(
        (sum, s) => sum + Number(s.quantity ?? 0) * Number(s.price ?? s.product?.price ?? 0),
        0
    );