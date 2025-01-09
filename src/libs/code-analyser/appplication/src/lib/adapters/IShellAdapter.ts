export interface IShellAdapter {
  getLocation(): string;
  setLocation(location: string): void;
  execute(command: string): void;
  executeMany(commands: string[]): void;
}
