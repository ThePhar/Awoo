type FailableOutput<T, E> = {
  error: E | null;
  output: T | undefined;
  arguments: IArguments;
}

export default FailableOutput
