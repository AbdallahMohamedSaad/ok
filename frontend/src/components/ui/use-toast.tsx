// Simple toast placeholder - in a real app you'd use sonner or react-hot-toast
export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    alert(`Success: ${message}`);
  },
  error: (message: string) => {
    console.log('❌ Error:', message);
    alert(`Error: ${message}`);
  },
  info: (message: string) => {
    console.log('ℹ️ Info:', message);
    alert(`Info: ${message}`);
  }
};