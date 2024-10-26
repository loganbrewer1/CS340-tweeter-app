import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageBytes: (bytes: Uint8Array) => void;
  setImageUrl: (url: string) => void;
  setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  public constructor(view: RegisterView) {
    super(view);
  }

  public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  }

  private handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    await this.handleAuthAction(
      () =>
        this.userService.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        ),
      rememberMe,
      "register user",
      "/"
    );
  }
}
