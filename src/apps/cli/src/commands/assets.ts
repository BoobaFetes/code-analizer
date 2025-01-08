interface IAsset {
  folder: { git: string };
}
export const asset: IAsset =
  process.env.NODE_ENV === 'production' ? newAsset() : newAsset('\\apps\\cli');

function newAsset(directory = ''): IAsset {
  return {
    folder: { git: `${process.cwd()}${directory}\\assets\\git` },
  };
}
