import { tick } from "svelte";

export async function ScrollHTMLContainerToBottom(container: HTMLElement, force: boolean = false) {
    const { scrollTop, scrollHeight, clientHeight } = container;

    const PixelsFromBottom = scrollHeight - scrollTop - clientHeight;
    const isChatScrolledToBottom = Math.abs(PixelsFromBottom) < 50;

    if (isChatScrolledToBottom || force) {
        await tick();
        container.scroll({
            top: container.scrollHeight,
            behavior: 'smooth'
        });
    }
}

