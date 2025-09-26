'use client';

import { useState, useEffect } from 'react';
import { HiCube, HiSparkles, HiCurrencyDollar, HiGift, HiArrowLeft, HiPlus, HiTrash, HiPencil, HiCheck, HiX, HiLogout, HiCog } from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';

interface VirtualItem {
  id: string;
  name: string;
  type: 'consumable' | 'non_consumable' | 'subscription';
  subtype?: 'currency' | 'item' | 'resource' | 'other';
  description: string;
  minPriceCents: number;
  maxPriceCents: number;
  priceTier?: number;
  category?: string;
  tags: string[];
  metadata: Record<string, any>;
  status: 'active' | 'inactive' | 'archived';
  color: string;
}

const virtualItemColors = [
  'bg-yellow-50 border-yellow-200',
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-purple-50 border-purple-200',
  'bg-pink-50 border-pink-200',
  'bg-indigo-50 border-indigo-200',
  'bg-red-50 border-red-200',
  'bg-orange-50 border-orange-200'
];

const formatCurrency = (cents: number) => {
  return `$${(cents / 100).toFixed(2)}`;
};

const getPriceFromTier = (tier: string) => {
  const tiers: Record<string, string> = {
    '1': '$0.99',
    '2': '$1.99',
    '3': '$2.99',
    '4': '$4.99',
    '5': '$9.99',
    '6': '$19.99'
  };
  return tiers[tier] || '$0.99';
};

export default function VirtualItemsPage() {
  const { user, signOut } = useAuth();
  const params = useParams();
  const gameId = params.id as string;
  
  const [game, setGame] = useState<any>(null);
  const [virtualItems, setVirtualItems] = useState<VirtualItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skuVariants, setSKUVariants] = useState<any[]>([]);
  const [loadingSKUs, setLoadingSKUs] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);
  const [itemForm, setItemForm] = useState({
    name: '',
    type: 'consumable' as 'consumable' | 'non_consumable' | 'subscription',
    subtype: 'currency' as 'currency' | 'item' | 'resource' | 'other',
    description: '',
    minPrice: '',
    maxPrice: '',
    priceTier: '1',
    category: '',
    tags: [] as string[],
    tagInput: '',
    status: 'active' as 'active' | 'inactive' | 'archived'
  });

  // Load game and virtual items
  useEffect(() => {
    if (user && gameId) {
      loadGame();
    }
  }, [user, gameId]);

  useEffect(() => {
    if (game) {
      loadVirtualItems();
    }
  }, [game]);

  // Fetch SKU variants when a virtual item is selected
  useEffect(() => {
    if (selectedItem && !isEditing) {
      fetchSKUVariants(selectedItem);
    } else {
      setSKUVariants([]);
    }
  }, [selectedItem, isEditing, gameId]);

  const loadGame = async () => {
    setGameLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}`);
      const data = await response.json();
      
      if (response.ok) {
        // Verify the game belongs to the current user
        if (data.game.developer_id !== user?.id) {
          alert('You do not have access to this game');
          window.location.href = '/dashboard';
          return;
        }
        setGame(data.game);
      } else {
        alert('Game not found');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error loading game:', error);
      alert('Error loading game');
      window.location.href = '/dashboard';
    } finally {
      setGameLoading(false);
    }
  };

  const loadVirtualItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}/virtual-items`);
      const data = await response.json();
      
      if (response.ok) {
        // Convert database format to frontend format
        const formattedItems = data.virtualItems.map((item: any, index: number) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          subtype: item.subtype,
          description: item.description || '',
          minPriceCents: item.min_price_cents || 0,
          maxPriceCents: item.max_price_cents || 0,
          priceTier: item.price_tier,
          category: item.category,
          tags: item.tags || [],
          metadata: item.metadata || {},
          status: item.status,
          color: virtualItemColors[index % virtualItemColors.length]
        }));
        
        setVirtualItems(formattedItems);
        if (formattedItems.length > 0) {
          setSelectedItem(formattedItems[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading virtual items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSKUVariants = async (virtualItemId: string) => {
    if (!gameId || !virtualItemId) return;
    
    setLoadingSKUs(true);
    try {
      const response = await fetch(`/api/games/${gameId}/sku-variants?virtual_item_id=${virtualItemId}`);
      const data = await response.json();
      
      if (response.ok) {
        // Extract variants from the grouped response
        const allVariants = data.virtual_items?.flatMap((item: any) => item.variants) || [];
        setSKUVariants(allVariants);
      } else {
        console.error('Failed to fetch SKU variants:', data.error);
        setSKUVariants([]);
      }
    } catch (error) {
      console.error('Error fetching SKU variants:', error);
      setSKUVariants([]);
    } finally {
      setLoadingSKUs(false);
    }
  };

  const selectedVirtualItem = virtualItems.find(item => item.id === selectedItem);

  const startEditing = (item?: VirtualItem) => {
    if (item) {
      setItemForm({
        name: item.name,
        type: item.type,
        subtype: item.subtype || 'currency',
        description: item.description,
        minPrice: formatCurrency(item.minPriceCents),
        maxPrice: formatCurrency(item.maxPriceCents),
        priceTier: item.priceTier?.toString() || '1',
        category: item.category || '',
        tags: item.tags,
        tagInput: '',
        status: item.status
      });
    } else {
      setItemForm({
        name: '',
        type: 'consumable',
        subtype: 'currency',
        description: '',
        minPrice: '',
        maxPrice: '',
        priceTier: '1',
        category: '',
        tags: [],
        tagInput: '',
        status: 'active'
      });
    }
    setIsEditing(true);
  };

  const saveVirtualItem = async () => {
    if (!game) return;

    const parsePriceToCents = (price: string) => {
      const cleanPrice = price.replace(/[$,]/g, '');
      return Math.round(parseFloat(cleanPrice) * 100);
    };

    setIsLoading(true);
    try {
      const itemData = {
        name: itemForm.name,
        description: itemForm.description,
        type: itemForm.type,
        subtype: itemForm.subtype,
        priceTier: parseInt(itemForm.priceTier),
        minPriceCents: parsePriceToCents(itemForm.minPrice || getPriceFromTier(itemForm.priceTier)),
        maxPriceCents: parsePriceToCents(itemForm.maxPrice || getPriceFromTier(itemForm.priceTier)),
        category: itemForm.category,
        tags: itemForm.tags,
        status: itemForm.status
      };

      if (selectedItem && virtualItems.find(item => item.id === selectedItem)) {
        // Update existing item
        const response = await fetch(`/api/games/${gameId}/virtual-items/${selectedItem}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          await loadVirtualItems();
        } else {
          const error = await response.json();
          alert('Error updating virtual item: ' + error.error);
        }
      } else {
        // Create new item
        const response = await fetch(`/api/games/${gameId}/virtual-items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          const result = await response.json();
          await loadVirtualItems();
          setSelectedItem(result.virtualItem.id);
        } else {
          const error = await response.json();
          alert('Error creating virtual item: ' + error.error);
        }
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving virtual item:', error);
      alert('Error saving virtual item');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVirtualItem = async (itemId: string) => {
    if (!game) return;

    if (confirm('Are you sure you want to delete this virtual item?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/games/${gameId}/virtual-items/${itemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadVirtualItems();
          if (selectedItem === itemId) {
            setSelectedItem(virtualItems[0]?.id || null);
          }
        } else {
          const error = await response.json();
          alert('Error deleting virtual item: ' + error.error);
        }
      } catch (error) {
        console.error('Error deleting virtual item:', error);
        alert('Error deleting virtual item');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getItemIcon = (itemName: string, itemType: string, subtype?: string) => {
    const name = itemName.toLowerCase();
    
    if (subtype === 'currency' || name.includes('coin') || name.includes('gold') || name.includes('gem')) {
      return <HiCurrencyDollar className="w-5 h-5 text-yellow-600" />;
    }
    if (itemType === 'subscription' || name.includes('pass') || name.includes('premium')) {
      return <HiSparkles className="w-5 h-5 text-purple-600" />;
    }
    if (name.includes('skin') || name.includes('cosmetic')) {
      return <HiGift className="w-5 h-5 text-pink-600" />;
    }
    return <HiCube className="w-5 h-5 text-gray-600" />;
  };

  const addTag = () => {
    if (itemForm.tagInput.trim() && !itemForm.tags.includes(itemForm.tagInput.trim())) {
      setItemForm(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setItemForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (gameLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Game not found</h2>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-black">Virtual Items</h1>
                  <p className="text-gray-600 mt-1">
                    Managing items for: <span className="font-medium">{game.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <HiLogout className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Virtual Items List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-black">Your Virtual Items</h2>
                  <button
                    onClick={() => startEditing()}
                    className="text-blue-600 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Add new virtual item"
                  >
                    <HiPlus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {virtualItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedItem === item.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getItemIcon(item.name, item.type, item.subtype)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-black truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.minPriceCents)}
                            {item.minPriceCents !== item.maxPriceCents && ` - ${formatCurrency(item.maxPriceCents)}`}
                          </p>
                          <div className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                            item.status === 'active' ? 'bg-green-100 text-green-800' :
                            item.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Virtual Item Details/Edit Form */}
            <div className="lg:col-span-2">
              {isEditing ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-black">
                      {selectedItem && virtualItems.find(item => item.id === selectedItem) ? 'Edit Virtual Item' : 'Add New Virtual Item'}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-md font-medium text-black mb-4">Basic Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                          <input
                            type="text"
                            value={itemForm.name}
                            onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Gold Coins"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <select
                            value={itemForm.type}
                            onChange={(e) => setItemForm(prev => ({ ...prev, type: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="consumable">Consumable</option>
                            <option value="non_consumable">Non-Consumable</option>
                            <option value="subscription">Subscription</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtype</label>
                          <select
                            value={itemForm.subtype}
                            onChange={(e) => setItemForm(prev => ({ ...prev, subtype: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="currency">Currency</option>
                            <option value="item">Item</option>
                            <option value="resource">Resource</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            value={itemForm.status}
                            onChange={(e) => setItemForm(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={itemForm.description}
                          onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Describe what this virtual item does..."
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h3 className="text-md font-medium text-black mb-4">Pricing</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price Tier</label>
                          <select
                            value={itemForm.priceTier}
                            onChange={(e) => setItemForm(prev => ({ ...prev, priceTier: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="1">Tier 1 ($0.99)</option>
                            <option value="2">Tier 2 ($1.99)</option>
                            <option value="3">Tier 3 ($2.99)</option>
                            <option value="4">Tier 4 ($4.99)</option>
                            <option value="5">Tier 5 ($9.99)</option>
                            <option value="6">Tier 6 ($19.99)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                          <input
                            type="text"
                            value={itemForm.minPrice}
                            onChange={(e) => setItemForm(prev => ({ ...prev, minPrice: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="$0.99"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                          <input
                            type="text"
                            value={itemForm.maxPrice}
                            onChange={(e) => setItemForm(prev => ({ ...prev, maxPrice: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="$9.99"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category and Tags */}
                    <div>
                      <h3 className="text-md font-medium text-black mb-4">Categorization</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <input
                            type="text"
                            value={itemForm.category}
                            onChange={(e) => setItemForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., cosmetic, currency, boost"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                          <div className="flex space-x-2 mb-2">
                            <input
                              type="text"
                              value={itemForm.tagInput}
                              onChange={(e) => setItemForm(prev => ({ ...prev, tagInput: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Add a tag..."
                            />
                            <button
                              onClick={addTag}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {itemForm.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-md"
                              >
                                {tag}
                                <button
                                  onClick={() => removeTag(tag)}
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                >
                                  <HiX className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveVirtualItem}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedVirtualItem ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      {getItemIcon(selectedVirtualItem.name, selectedVirtualItem.type, selectedVirtualItem.subtype)}
                      <h2 className="text-lg font-semibold text-black">{selectedVirtualItem.name}</h2>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        selectedVirtualItem.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedVirtualItem.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedVirtualItem.status}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(selectedVirtualItem)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteVirtualItem(selectedVirtualItem.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-black mb-2">Description</h3>
                      <p className="text-gray-600">{selectedVirtualItem.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-md font-medium text-black mb-2">Type Information</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Type:</span> {selectedVirtualItem.type.replace('_', ' ')}
                          </p>
                          {selectedVirtualItem.subtype && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Subtype:</span> {selectedVirtualItem.subtype}
                            </p>
                          )}
                          {selectedVirtualItem.category && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Category:</span> {selectedVirtualItem.category}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-medium text-black mb-2">Pricing</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Price Range:</span> {formatCurrency(selectedVirtualItem.minPriceCents)}
                            {selectedVirtualItem.minPriceCents !== selectedVirtualItem.maxPriceCents && ` - ${formatCurrency(selectedVirtualItem.maxPriceCents)}`}
                          </p>
                          {selectedVirtualItem.priceTier && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Price Tier:</span> {selectedVirtualItem.priceTier}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedVirtualItem.tags.length > 0 && (
                      <div>
                        <h3 className="text-md font-medium text-black mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedVirtualItem.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-md font-medium text-black mb-2">Usage in Code</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Reference this virtual item in your game code:
                      </p>
                      <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
                        VirtualItem.{selectedVirtualItem.id}
                      </code>
                    </div>

                    {/* SKU Variants Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-medium text-blue-900">App Store SKU Variants</h3>
                        {loadingSKUs && (
                          <div className="text-sm text-blue-600">Loading variants...</div>
                        )}
                      </div>
                      
                      {skuVariants.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-blue-700 mb-3">
                            {skuVariants.length} SKU variant{skuVariants.length > 1 ? 's' : ''} created for A/B testing:
                          </p>
                          <div className="grid gap-2">
                            {skuVariants.map((variant, index) => (
                              <div key={variant.id} className="bg-white border border-blue-200 rounded p-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-gray-900">
                                    {variant.name || `Variant ${index + 1}`}
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-green-600">
                                      ${(variant.price_cents / 100).toFixed(2)}
                                    </div>
                                    {variant.quantity > 1 && (
                                      <div className="text-xs text-gray-500">
                                        {variant.quantity}x quantity
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Product ID: {variant.app_store_product_id}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <div className={`text-xs px-2 py-0.5 rounded ${
                                    variant.status === 'active' ? 'bg-green-100 text-green-700' :
                                    variant.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {variant.status}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {new Date(variant.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <HiCog className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                          <p className="text-sm text-blue-700 mb-2">
                            No SKU variants created yet
                          </p>
                          <p className="text-xs text-blue-600">
                            SKU variants will be automatically generated when you start A/B testing
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <HiCube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Virtual Item Selected</h3>
                  <p className="text-gray-600 mb-4">Select a virtual item from the list to view its details</p>
                  <button
                    onClick={() => startEditing()}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <HiPlus className="w-4 h-4 mr-2" />
                    Add Your First Virtual Item
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}