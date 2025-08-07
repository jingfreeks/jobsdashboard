
import { render, screen, fireEvent } from '@/testUtils';
import CityItem from './CityItem';
import { describe, it, expect, vi } from 'vitest';

describe('CityItem', () => {
  const city = {
    _id: '1',
    name: 'Sample City',
    statename: 'Sample State',
    image: 'https://example.com/image.jpg',
    address: '',
    stateId: 'state1',
  };
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  it('renders city name, state, and image', () => {
    render(
      <CityItem
        city={city}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={false}
      />
    );
    expect(screen.getByText('Sample City')).toBeInTheDocument();
    expect(screen.getByText('Sample State')).toBeInTheDocument();
    expect(screen.getByAltText('Sample City city')).toBeInTheDocument();
  });

  it('renders fallback when image is missing', () => {
    render(
      <CityItem
        city={{ ...city, image: undefined }}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={false}
      />
    );
    expect(screen.getByText('No img')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <CityItem
        city={city}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={false}
      />
    );
    const editButton = screen.getAllByRole('button')[0];
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(city);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <CityItem
        city={city}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={false}
      />
    );
    const deleteButton = screen.getAllByRole('button')[1];
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(city._id);
  });

  it('disables buttons when isDeleting is true', () => {
    render(
      <CityItem
        city={city}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={true}
      />
    );
    const [editButton] = screen.getAllByRole('button');
    expect(editButton).toBeDisabled()
  });
});