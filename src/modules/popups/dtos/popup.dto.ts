export class PopupDto {
  constructor(popup) {
    this.id = popup.id;
    this.photoKey = popup.file?.key;
  }

  id: number;
  photoKey: string;
}
