import { Presenter, View } from "./Presenter";

export interface InfoView extends View {
  displayInfoMessage: (message: string, timeout: number) => void;
  clearLastInfoMessage: () => void;
}

export abstract class InfoPresenter<
  U,
  V extends InfoView
> extends Presenter<V> {
  private _service: U;

  constructor(view: V) {
    super(view);
    this._service = this.createService();
  }

  public get service() {
    return this._service;
  }

  protected abstract createService(): U;
}
