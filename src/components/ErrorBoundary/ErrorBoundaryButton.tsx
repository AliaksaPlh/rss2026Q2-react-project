import React from 'react';
import Button from '../ui/Button/Button';

interface BuggyComponentState {
  crash: boolean;
}

class ErrorBoundaryButton extends React.Component<
  unknown,
  BuggyComponentState
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      crash: false,
    };
  }

  handleClick = () => {
    this.setState({ crash: true });
  };

  render() {
    if (this.state.crash) {
      throw new Error('💥 ErrorBoundary check');
    }

    return (
      <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/30 px-4 py-3">
        <p className="mb-3 text-center text-xs text-slate-500">
          Demo: triggers an error to test the boundary above
        </p>
        <Button
          onClick={this.handleClick}
          variant="outline"
          className="w-full border-rose-500/40 text-rose-200 hover:border-rose-400/60 hover:bg-rose-950/40 hover:text-rose-100"
        >
          Throw test error 💥
        </Button>
      </div>
    );
  }
}

export default ErrorBoundaryButton;
