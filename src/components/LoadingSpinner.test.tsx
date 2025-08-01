import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner with text', () => {
    const { container } = render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    
    // Snapshot test
    expect(container).toMatchSnapshot();
  });

  it('has correct styling classes', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinnerContainer = container.firstChild as HTMLElement;
    expect(spinnerContainer).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-slate-100');
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600');
  });

  it('matches loading spinner snapshot', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container).toMatchSnapshot();
  });
}); 