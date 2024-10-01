import * as bootstrap from 'bootstrap';

export class ModalManager {
  private modalElement: HTMLElement | null = null;

  constructor() {}

  public open(modalId: string): void {
    this.modalElement = document.getElementById(modalId);
    if (this.modalElement) {
      const modal = new bootstrap.Modal(this.modalElement);
      modal.show();
    } else {
      console.error(`modal with id ${modalId} not found`);
    }
  }

  public close(modalId: string): void {
    this.modalElement = document.getElementById(modalId);
    if (this.modalElement) {
      const modal = bootstrap.Modal.getInstance(this.modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  public setModalContent(modalId: string, content: string): void {
    const modalBody = document.querySelector(
      `#${modalId} .modal-body`
    ) as HTMLElement;
    if (modalBody) {
      modalBody.innerHTML = content;
    }
  }
}
