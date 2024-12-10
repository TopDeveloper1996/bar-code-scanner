import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Item {
  id: number;
  name: string;
  itemRef: string;
  sku: string;
  stock: number;
  image: string;
  lastEdit: string;
}

interface ItemsState {
  items: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      id: 1,
      name: 'Therabody Goggles',
      itemRef: 'E46-T98',
      sku: 'THE-SMA',
      stock: 50,
      image: '/placeholder.svg',
      lastEdit: '10/08/2024'
    },
    {
      id: 2,
      name: 'Smart Goggles',
      itemRef: 'E46-T75',
      sku: 'SG-SMA',
      stock: 35,
      image: '/placeholder.svg',
      lastEdit: '10/08/2024'
    },
    {
      id: 3,
      name: 'Smart Watch',
      itemRef: '12345678905',
      sku: 'SWA-WA',
      stock: 92,
      image: '/placeholder.svg',
      lastEdit: '10/08/2024'
    },
  ];
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch items';
      });
  },
});

export default itemsSlice.reducer;

