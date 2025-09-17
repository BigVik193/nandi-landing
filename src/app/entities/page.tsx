'use client';

import { useState, useEffect } from 'react';
import { HiSearch, HiCode, HiPlusCircle, HiTrash, HiCurrencyDollar, HiColorSwatch, HiBadgeCheck, HiLightningBolt, HiGift, HiStar, HiSparkles, HiHeart, HiCubeTransparent } from 'react-icons/hi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function EntitiesPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>('gems');
  const [searchCode, setSearchCode] = useState('');
  const [searchEntities, setSearchEntities] = useState('');
  const [storeType, setStoreType] = useState<'existing' | 'new' | null>(null);
  const [entityForm, setEntityForm] = useState({
    name: '',
    type: 'currency',
    description: '',
    minPrice: '',
    maxPrice: '',
    definedInFile: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Read store type from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storeTypeParam = urlParams.get('storeType') as 'existing' | 'new' | null;
    setStoreType(storeTypeParam);
  }, []);

  // Game entities
  const [gameEntities, setGameEntities] = useState([
    { 
      id: 'gems', 
      name: 'Gems', 
      type: 'currency', 
      definedInFile: 'PlayerCurrency.cs', 
      description: 'Premium currency for special purchases',
      minPrice: '$0.99',
      maxPrice: '$4.99',
      codeRef: 'PlayerCurrency.cs:AddGems()',
      color: 'bg-purple-50 border-purple-200'
    },
    { 
      id: 'coins', 
      name: 'Coins', 
      type: 'currency', 
      definedInFile: 'PlayerCurrency.cs', 
      description: 'Basic in-game currency earned through gameplay',
      minPrice: '$0.50',
      maxPrice: '$2.99',
      codeRef: 'PlayerCurrency.cs:AddCoins()',
      color: 'bg-yellow-50 border-yellow-200'
    },
    { 
      id: 'rare_skins', 
      name: 'Rare Skins', 
      type: 'cosmetic', 
      definedInFile: 'SkinManager.cs', 
      description: 'Character skins with rare rarity',
      minPrice: '$1.99',
      maxPrice: '$3.99',
      codeRef: 'SkinManager.cs:UnlockSkin()',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'epic_skins',
      name: 'Epic Skins',
      type: 'cosmetic',
      definedInFile: 'SkinManager.cs',
      description: 'High-tier character skins with special effects',
      minPrice: '$4.99',
      maxPrice: '$9.99',
      codeRef: 'SkinManager.cs:UnlockEpicSkin()',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'weapon_skins',
      name: 'Weapon Skins',
      type: 'cosmetic',
      definedInFile: 'WeaponSkinManager.cs',
      description: 'Cosmetic weapon appearances and effects',
      minPrice: '$2.99',
      maxPrice: '$7.99',
      codeRef: 'WeaponSkinManager.cs:UnlockWeaponSkin()',
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'health_potions',
      name: 'Health Potions',
      type: 'consumable',
      definedInFile: 'ConsumableManager.cs',
      description: 'Restores player health instantly',
      minPrice: '$0.99',
      maxPrice: '$1.99',
      codeRef: 'ConsumableManager.cs:UseHealthPotion()',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'energy_drinks',
      name: 'Energy Drinks',
      type: 'consumable',
      definedInFile: 'ConsumableManager.cs',
      description: 'Boosts movement speed for limited time',
      minPrice: '$0.99',
      maxPrice: '$2.49',
      codeRef: 'ConsumableManager.cs:UseEnergyDrink()',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'xp_boosters',
      name: 'XP Boosters',
      type: 'progression',
      definedInFile: 'ProgressionManager.cs',
      description: 'Doubles experience gain for 1 hour',
      minPrice: '$1.99',
      maxPrice: '$4.99',
      codeRef: 'ProgressionManager.cs:ActivateXPBooster()',
      color: 'bg-cyan-50 border-cyan-200'
    },
    {
      id: 'battle_pass',
      name: 'Battle Pass',
      type: 'progression',
      definedInFile: 'BattlePassManager.cs',
      description: 'Seasonal progression track with exclusive rewards',
      minPrice: '$9.99',
      maxPrice: '$19.99',
      codeRef: 'BattlePassManager.cs:UnlockBattlePass()',
      color: 'bg-emerald-50 border-emerald-200'
    },
    {
      id: 'loot_boxes',
      name: 'Loot Boxes',
      type: 'consumable',
      definedInFile: 'LootBoxManager.cs',
      description: 'Contains random cosmetic items and currency',
      minPrice: '$2.99',
      maxPrice: '$9.99',
      codeRef: 'LootBoxManager.cs:OpenLootBox()',
      color: 'bg-violet-50 border-violet-200'
    }
  ]);

  // Codebase files
  const codebaseFiles = [
    {
      name: 'PlayerCurrency.cs',
      path: '/Scripts/Player/PlayerCurrency.cs',
      content: `using UnityEngine;
using System;

public static class PlayerCurrency {
    public static int Gems { get; private set; }
    public static int Coins { get; private set; }
    
    public static event Action OnCurrencyChanged;
    
    static PlayerCurrency() {
        LoadCurrency();
    }
    
    public static void AddGems(int amount) {
        if (amount <= 0) return;
        Gems += amount;
        SaveCurrency();
        OnCurrencyChanged?.Invoke();
        NandiAPI.TrackPurchase("gems", amount);
        Debug.Log($"Added {amount} gems. Total: {Gems}");
    }
    
    public static void AddCoins(int amount) {
        if (amount <= 0) return;
        Coins += amount;
        SaveCurrency();
        OnCurrencyChanged?.Invoke();
        NandiAPI.TrackPurchase("coins", amount);
        Debug.Log($"Added {amount} coins. Total: {Coins}");
    }
    
    public static bool SpendGems(int amount) {
        if (amount <= 0 || Gems < amount) return false;
        Gems -= amount;
        SaveCurrency();
        OnCurrencyChanged?.Invoke();
        Debug.Log($"Spent {amount} gems. Remaining: {Gems}");
        return true;
    }
    
    public static bool SpendCoins(int amount) {
        if (amount <= 0 || Coins < amount) return false;
        Coins -= amount;
        SaveCurrency();
        OnCurrencyChanged?.Invoke();
        Debug.Log($"Spent {amount} coins. Remaining: {Coins}");
        return true;
    }
    
    private static void LoadCurrency() {
        Gems = PlayerPrefs.GetInt("PlayerGems", 0);
        Coins = PlayerPrefs.GetInt("PlayerCoins", 100); // Starting coins
    }
    
    private static void SaveCurrency() {
        PlayerPrefs.SetInt("PlayerGems", Gems);
        PlayerPrefs.SetInt("PlayerCoins", Coins);
        PlayerPrefs.Save();
    }
}`
    },
    {
      name: 'SkinManager.cs',
      path: '/Scripts/Cosmetics/SkinManager.cs',
      content: `using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class SkinManager : MonoBehaviour {
    [Header("Skin Database")]
    public SkinDatabase skinDatabase;
    
    [Header("Current Skin")]
    public string currentSkinId = "default";
    
    private void Start() {
        LoadEquippedSkin();
        ApplySkin(currentSkinId);
    }
    
    public void UnlockSkin(string skinId) {
        var skin = skinDatabase.GetSkin(skinId);
        if (skin != null && !skin.isUnlocked) {
            skin.isUnlocked = true;
            PlayerData.Save();
            NandiAPI.TrackPurchase("skin", skinId);
            Debug.Log($"Unlocked skin: {skin.name}");
        }
    }
    
    public void UnlockEpicSkin(string skinId) {
        var skin = skinDatabase.GetSkin(skinId);
        if (skin != null && skin.rarity == SkinRarity.Epic) {
            UnlockSkin(skinId);
            // Add special effects for epic skins
            GameObject.FindWithTag("Player")?.GetComponent<PlayerEffects>()?.
                AddEpicSkinEffect(skin.effectPrefab);
        }
    }
    
    public bool IsSkinUnlocked(string skinId) {
        var skin = skinDatabase.GetSkin(skinId);
        return skin?.isUnlocked ?? false;
    }
    
    public void EquipSkin(string skinId) {
        if (IsSkinUnlocked(skinId)) {
            currentSkinId = skinId;
            ApplySkin(skinId);
            SaveEquippedSkin();
            Debug.Log($"Equipped skin: {skinId}");
        }
    }
    
    private void ApplySkin(string skinId) {
        var skin = skinDatabase.GetSkin(skinId);
        if (skin != null) {
            var playerRenderer = GameObject.FindWithTag("Player")?.
                GetComponent<Renderer>();
            if (playerRenderer != null) {
                playerRenderer.material = skin.material;
            }
        }
    }
    
    private void LoadEquippedSkin() {
        currentSkinId = PlayerPrefs.GetString("EquippedSkin", "default");
    }
    
    private void SaveEquippedSkin() {
        PlayerPrefs.SetString("EquippedSkin", currentSkinId);
        PlayerPrefs.Save();
    }
}`
    },
    {
      name: 'WeaponSkinManager.cs',
      path: '/Scripts/Cosmetics/WeaponSkinManager.cs',
      content: `using UnityEngine;
using System.Collections.Generic;

public class WeaponSkinManager : MonoBehaviour {
    [Header("Weapon Skin Database")]
    public WeaponSkinDatabase weaponSkinDatabase;
    
    [Header("Current Weapon Skins")]
    public Dictionary<WeaponType, string> equippedSkins = new Dictionary<WeaponType, string>();
    
    private void Start() {
        LoadEquippedSkins();
        ApplyAllWeaponSkins();
    }
    
    public void UnlockWeaponSkin(string skinId) {
        var weaponSkin = weaponSkinDatabase.GetWeaponSkin(skinId);
        if (weaponSkin != null && !weaponSkin.isUnlocked) {
            weaponSkin.isUnlocked = true;
            PlayerData.Save();
            NandiAPI.TrackPurchase("weapon_skin", skinId);
            Debug.Log($"Unlocked weapon skin: {weaponSkin.name}");
        }
    }
    
    public void EquipWeaponSkin(WeaponType weaponType, string skinId) {
        var weaponSkin = weaponSkinDatabase.GetWeaponSkin(skinId);
        if (weaponSkin != null && weaponSkin.isUnlocked && weaponSkin.weaponType == weaponType) {
            equippedSkins[weaponType] = skinId;
            ApplyWeaponSkin(weaponType, skinId);
            SaveEquippedSkins();
            Debug.Log($"Equipped {weaponType} skin: {weaponSkin.name}");
        }
    }
    
    private void ApplyWeaponSkin(WeaponType weaponType, string skinId) {
        var weaponSkin = weaponSkinDatabase.GetWeaponSkin(skinId);
        if (weaponSkin != null) {
            var weaponObject = GameObject.FindWithTag($"{weaponType}Weapon");
            if (weaponObject != null) {
                var renderer = weaponObject.GetComponent<Renderer>();
                if (renderer != null) {
                    renderer.material = weaponSkin.material;
                }
                
                // Apply special effects for legendary skins
                if (weaponSkin.rarity == WeaponSkinRarity.Legendary) {
                    var effectsComponent = weaponObject.GetComponent<WeaponEffects>();
                    effectsComponent?.EnableLegendaryEffect(weaponSkin.effectPrefab);
                }
            }
        }
    }
    
    private void ApplyAllWeaponSkins() {
        foreach (var kvp in equippedSkins) {
            ApplyWeaponSkin(kvp.Key, kvp.Value);
        }
    }
    
    private void LoadEquippedSkins() {
        // Load from PlayerPrefs - simplified for demo
        equippedSkins[WeaponType.Sword] = PlayerPrefs.GetString("EquippedSwordSkin", "default_sword");
        equippedSkins[WeaponType.Bow] = PlayerPrefs.GetString("EquippedBowSkin", "default_bow");
        equippedSkins[WeaponType.Staff] = PlayerPrefs.GetString("EquippedStaffSkin", "default_staff");
    }
    
    private void SaveEquippedSkins() {
        foreach (var kvp in equippedSkins) {
            PlayerPrefs.SetString($"Equipped{kvp.Key}Skin", kvp.Value);
        }
        PlayerPrefs.Save();
    }
}

public enum WeaponType {
    Sword,
    Bow,
    Staff
}

public enum WeaponSkinRarity {
    Common,
    Rare,
    Epic,
    Legendary
}`
    },
    {
      name: 'ConsumableManager.cs',
      path: '/Scripts/Items/ConsumableManager.cs',
      content: `using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class ConsumableManager : MonoBehaviour {
    [Header("Player References")]
    public PlayerHealth playerHealth;
    public PlayerMovement playerMovement;
    
    [Header("Consumable Inventory")]
    public Dictionary<string, int> consumableInventory = new Dictionary<string, int>();
    
    private void Start() {
        LoadInventory();
    }
    
    public void AddConsumable(string consumableId, int quantity) {
        if (consumableInventory.ContainsKey(consumableId)) {
            consumableInventory[consumableId] += quantity;
        } else {
            consumableInventory[consumableId] = quantity;
        }
        SaveInventory();
        Debug.Log($"Added {quantity} {consumableId} to inventory");
    }
    
    public bool UseHealthPotion() {
        const string potionId = "health_potion";
        if (consumableInventory.ContainsKey(potionId) && consumableInventory[potionId] > 0) {
            consumableInventory[potionId]--;
            
            // Restore health
            if (playerHealth != null) {
                playerHealth.Heal(50f); // Heal 50 HP
                Debug.Log("Used health potion - restored 50 HP");
            }
            
            SaveInventory();
            NandiAPI.TrackConsumableUse(potionId);
            return true;
        }
        return false;
    }
    
    public bool UseEnergyDrink() {
        const string drinkId = "energy_drink";
        if (consumableInventory.ContainsKey(drinkId) && consumableInventory[drinkId] > 0) {
            consumableInventory[drinkId]--;
            
            // Apply speed boost
            if (playerMovement != null) {
                StartCoroutine(ApplySpeedBoost(10f, 2.0f)); // 2x speed for 10 seconds
                Debug.Log("Used energy drink - speed boosted for 10 seconds");
            }
            
            SaveInventory();
            NandiAPI.TrackConsumableUse(drinkId);
            return true;
        }
        return false;
    }
    
    private IEnumerator ApplySpeedBoost(float duration, float multiplier) {
        float originalSpeed = playerMovement.moveSpeed;
        playerMovement.moveSpeed *= multiplier;
        
        yield return new WaitForSeconds(duration);
        
        playerMovement.moveSpeed = originalSpeed;
        Debug.Log("Speed boost expired");
    }
    
    public int GetConsumableCount(string consumableId) {
        return consumableInventory.ContainsKey(consumableId) ? consumableInventory[consumableId] : 0;
    }
    
    private void LoadInventory() {
        // Simplified loading from PlayerPrefs
        consumableInventory["health_potion"] = PlayerPrefs.GetInt("HealthPotions", 0);
        consumableInventory["energy_drink"] = PlayerPrefs.GetInt("EnergyDrinks", 0);
    }
    
    private void SaveInventory() {
        foreach (var kvp in consumableInventory) {
            PlayerPrefs.SetInt(kvp.Key.Replace("_", "").ToTitleCase(), kvp.Value);
        }
        PlayerPrefs.Save();
    }
}`
    },
    {
      name: 'ProgressionManager.cs',
      path: '/Scripts/Progression/ProgressionManager.cs',
      content: `using UnityEngine;
using System;
using System.Collections;

public class ProgressionManager : MonoBehaviour {
    [Header("Player Level")]
    public int currentLevel = 1;
    public float currentXP = 0f;
    public float xpToNextLevel = 100f;
    
    [Header("XP Booster")]
    public bool isXPBoosterActive = false;
    public float xpBoosterMultiplier = 2.0f;
    public float xpBoosterTimeRemaining = 0f;
    
    public static event Action<int> OnLevelUp;
    public static event Action<float> OnXPGained;
    public static event Action<bool> OnXPBoosterChanged;
    
    private void Start() {
        LoadProgressionData();
    }
    
    private void Update() {
        if (isXPBoosterActive) {
            xpBoosterTimeRemaining -= Time.deltaTime;
            if (xpBoosterTimeRemaining <= 0f) {
                DeactivateXPBooster();
            }
        }
    }
    
    public void GainXP(float amount) {
        if (amount <= 0) return;
        
        float multipliedXP = isXPBoosterActive ? amount * xpBoosterMultiplier : amount;
        currentXP += multipliedXP;
        
        OnXPGained?.Invoke(multipliedXP);
        
        // Check for level up
        while (currentXP >= xpToNextLevel) {
            LevelUp();
        }
        
        SaveProgressionData();
        Debug.Log($"Gained {multipliedXP} XP. Total: {currentXP}/{xpToNextLevel}");
    }
    
    private void LevelUp() {
        currentXP -= xpToNextLevel;
        currentLevel++;
        
        // Increase XP requirement for next level
        xpToNextLevel = Mathf.Floor(xpToNextLevel * 1.2f);
        
        OnLevelUp?.Invoke(currentLevel);
        
        // Give level up rewards
        PlayerCurrency.AddCoins(currentLevel * 10);
        if (currentLevel % 5 == 0) {
            PlayerCurrency.AddGems(5); // Bonus gems every 5 levels
        }
        
        Debug.Log($"Level up! Now level {currentLevel}. Next level requires {xpToNextLevel} XP");
    }
    
    public void ActivateXPBooster(float duration = 3600f) { // 1 hour default
        isXPBoosterActive = true;
        xpBoosterTimeRemaining = duration;
        OnXPBoosterChanged?.Invoke(true);
        NandiAPI.TrackConsumableUse("xp_booster");
        Debug.Log($"XP Booster activated for {duration / 60f} minutes");
    }
    
    private void DeactivateXPBooster() {
        isXPBoosterActive = false;
        xpBoosterTimeRemaining = 0f;
        OnXPBoosterChanged?.Invoke(false);
        Debug.Log("XP Booster expired");
    }
    
    public float GetLevelProgress() {
        return currentXP / xpToNextLevel;
    }
    
    public string GetFormattedBoosterTime() {
        if (!isXPBoosterActive) return "";
        
        int minutes = Mathf.FloorToInt(xpBoosterTimeRemaining / 60f);
        int seconds = Mathf.FloorToInt(xpBoosterTimeRemaining % 60f);
        return $"{minutes:00}:{seconds:00}";
    }
    
    private void LoadProgressionData() {
        currentLevel = PlayerPrefs.GetInt("PlayerLevel", 1);
        currentXP = PlayerPrefs.GetFloat("PlayerXP", 0f);
        xpToNextLevel = PlayerPrefs.GetFloat("XPToNextLevel", 100f);
    }
    
    private void SaveProgressionData() {
        PlayerPrefs.SetInt("PlayerLevel", currentLevel);
        PlayerPrefs.SetFloat("PlayerXP", currentXP);
        PlayerPrefs.SetFloat("XPToNextLevel", xpToNextLevel);
        PlayerPrefs.Save();
    }
}`
    },
    {
      name: 'BattlePassManager.cs',
      path: '/Scripts/Progression/BattlePassManager.cs',
      content: `using UnityEngine;
using System.Collections.Generic;
using System;

public class BattlePassManager : MonoBehaviour {
    [Header("Battle Pass Settings")]
    public bool isPremiumUnlocked = false;
    public int currentTier = 0;
    public int battlePassXP = 0;
    public int xpPerTier = 500;
    public int maxTiers = 100;
    
    [Header("Current Season")]
    public int currentSeason = 1;
    public DateTime seasonEndDate;
    
    public static event Action<int> OnTierUnlocked;
    public static event Action<BattlePassReward> OnRewardClaimed;
    
    private List<BattlePassTier> battlePassTiers;
    
    private void Start() {
        LoadBattlePassData();
        InitializeBattlePassTiers();
    }
    
    public void UnlockBattlePass() {
        if (!isPremiumUnlocked) {
            isPremiumUnlocked = true;
            SaveBattlePassData();
            NandiAPI.TrackPurchase("battle_pass", currentSeason.ToString());
            Debug.Log($"Battle Pass Season {currentSeason} unlocked!");
            
            // Unlock all premium rewards for current tiers
            for (int i = 0; i <= currentTier; i++) {
                var tier = GetBattlePassTier(i);
                if (tier != null && tier.premiumReward != null && !tier.premiumReward.isClaimed) {
                    ClaimReward(tier.premiumReward);
                }
            }
        }
    }
    
    public void AddBattlePassXP(int amount) {
        if (amount <= 0) return;
        
        battlePassXP += amount;
        
        // Check for tier progression
        int newTier = Mathf.Min(battlePassXP / xpPerTier, maxTiers - 1);
        
        while (currentTier < newTier) {
            currentTier++;
            OnTierUnlocked?.Invoke(currentTier);
            
            var tier = GetBattlePassTier(currentTier);
            if (tier != null) {
                // Auto-claim free rewards
                if (tier.freeReward != null && !tier.freeReward.isClaimed) {
                    ClaimReward(tier.freeReward);
                }
                
                // Auto-claim premium rewards if unlocked
                if (isPremiumUnlocked && tier.premiumReward != null && !tier.premiumReward.isClaimed) {
                    ClaimReward(tier.premiumReward);
                }
            }
            
            Debug.Log($"Battle Pass tier {currentTier} unlocked!");
        }
        
        SaveBattlePassData();
    }
    
    private void ClaimReward(BattlePassReward reward) {
        if (reward.isClaimed) return;
        
        reward.isClaimed = true;
        
        switch (reward.type) {
            case RewardType.Coins:
                PlayerCurrency.AddCoins(reward.amount);
                break;
            case RewardType.Gems:
                PlayerCurrency.AddGems(reward.amount);
                break;
            case RewardType.Skin:
                FindObjectOfType<SkinManager>()?.UnlockSkin(reward.itemId);
                break;
            case RewardType.WeaponSkin:
                FindObjectOfType<WeaponSkinManager>()?.UnlockWeaponSkin(reward.itemId);
                break;
            case RewardType.Consumable:
                FindObjectOfType<ConsumableManager>()?.AddConsumable(reward.itemId, reward.amount);
                break;
        }
        
        OnRewardClaimed?.Invoke(reward);
        Debug.Log($"Claimed Battle Pass reward: {reward.name}");
    }
    
    private BattlePassTier GetBattlePassTier(int tier) {
        if (tier >= 0 && tier < battlePassTiers.Count) {
            return battlePassTiers[tier];
        }
        return null;
    }
    
    public int GetCurrentTierProgress() {
        return battlePassXP % xpPerTier;
    }
    
    public float GetTierProgressPercentage() {
        return (float)GetCurrentTierProgress() / xpPerTier;
    }
    
    public bool IsSeasonActive() {
        return DateTime.Now < seasonEndDate;
    }
    
    private void InitializeBattlePassTiers() {
        battlePassTiers = new List<BattlePassTier>();
        
        // Initialize tiers with rewards (simplified for demo)
        for (int i = 0; i < maxTiers; i++) {
            var tier = new BattlePassTier {
                tierNumber = i,
                freeReward = CreateReward($"Free Tier {i}", RewardType.Coins, 50),
                premiumReward = i % 5 == 0 ? CreateReward($"Premium Tier {i}", RewardType.Gems, 10) : 
                               CreateReward($"Premium Tier {i}", RewardType.Coins, 100)
            };
            battlePassTiers.Add(tier);
        }
    }
    
    private BattlePassReward CreateReward(string name, RewardType type, int amount, string itemId = "") {
        return new BattlePassReward {
            name = name,
            type = type,
            amount = amount,
            itemId = itemId,
            isClaimed = false
        };
    }
    
    private void LoadBattlePassData() {
        isPremiumUnlocked = PlayerPrefs.GetInt("BattlePassPremium", 0) == 1;
        currentTier = PlayerPrefs.GetInt("BattlePassTier", 0);
        battlePassXP = PlayerPrefs.GetInt("BattlePassXP", 0);
        currentSeason = PlayerPrefs.GetInt("BattlePassSeason", 1);
    }
    
    private void SaveBattlePassData() {
        PlayerPrefs.SetInt("BattlePassPremium", isPremiumUnlocked ? 1 : 0);
        PlayerPrefs.SetInt("BattlePassTier", currentTier);
        PlayerPrefs.SetInt("BattlePassXP", battlePassXP);
        PlayerPrefs.SetInt("BattlePassSeason", currentSeason);
        PlayerPrefs.Save();
    }
}

[System.Serializable]
public class BattlePassTier {
    public int tierNumber;
    public BattlePassReward freeReward;
    public BattlePassReward premiumReward;
}

[System.Serializable]
public class BattlePassReward {
    public string name;
    public RewardType type;
    public int amount;
    public string itemId;
    public bool isClaimed;
}

public enum RewardType {
    Coins,
    Gems,
    Skin,
    WeaponSkin,
    Consumable
}`
    },
    {
      name: 'LootBoxManager.cs',
      path: '/Scripts/Items/LootBoxManager.cs',
      content: `using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class LootBoxManager : MonoBehaviour {
    [Header("Loot Box Settings")]
    public List<LootBoxType> lootBoxTypes;
    
    [Header("Drop Rates")]
    [Range(0f, 1f)] public float commonDropRate = 0.6f;
    [Range(0f, 1f)] public float rareDropRate = 0.25f;
    [Range(0f, 1f)] public float epicDropRate = 0.12f;
    [Range(0f, 1f)] public float legendaryDropRate = 0.03f;
    
    private Dictionary<string, int> lootBoxInventory = new Dictionary<string, int>();
    
    private void Start() {
        LoadLootBoxInventory();
    }
    
    public void AddLootBox(string lootBoxId, int quantity) {
        if (lootBoxInventory.ContainsKey(lootBoxId)) {
            lootBoxInventory[lootBoxId] += quantity;
        } else {
            lootBoxInventory[lootBoxId] = quantity;
        }
        SaveLootBoxInventory();
        Debug.Log($"Added {quantity} {lootBoxId} loot boxes");
    }
    
    public List<LootBoxReward> OpenLootBox(string lootBoxId) {
        if (!lootBoxInventory.ContainsKey(lootBoxId) || lootBoxInventory[lootBoxId] <= 0) {
            Debug.LogWarning($"No {lootBoxId} loot boxes available");
            return new List<LootBoxReward>();
        }
        
        lootBoxInventory[lootBoxId]--;
        SaveLootBoxInventory();
        
        var lootBoxType = lootBoxTypes.FirstOrDefault(lb => lb.id == lootBoxId);
        if (lootBoxType == null) {
            Debug.LogError($"Loot box type {lootBoxId} not found");
            return new List<LootBoxReward>();
        }
        
        var rewards = GenerateRewards(lootBoxType);
        
        // Give rewards to player
        foreach (var reward in rewards) {
            GiveRewardToPlayer(reward);
        }
        
        NandiAPI.TrackLootBoxOpen(lootBoxId, rewards);
        Debug.Log($"Opened {lootBoxId} loot box, received {rewards.Count} items");
        
        return rewards;
    }
    
    private List<LootBoxReward> GenerateRewards(LootBoxType lootBoxType) {
        var rewards = new List<LootBoxReward>();
        
        for (int i = 0; i < lootBoxType.guaranteedRewardCount; i++) {
            var rarity = DetermineRarity();
            var availableRewards = lootBoxType.possibleRewards.Where(r => r.rarity == rarity).ToList();
            
            if (availableRewards.Count > 0) {
                var selectedReward = availableRewards[Random.Range(0, availableRewards.Count)];
                var reward = new LootBoxReward {
                    id = selectedReward.id,
                    name = selectedReward.name,
                    type = selectedReward.type,
                    rarity = selectedReward.rarity,
                    amount = Random.Range(selectedReward.minAmount, selectedReward.maxAmount + 1),
                    itemId = selectedReward.itemId
                };
                rewards.Add(reward);
            }
        }
        
        return rewards;
    }
    
    private LootRarity DetermineRarity() {
        float randomValue = Random.Range(0f, 1f);
        
        if (randomValue <= legendaryDropRate) {
            return LootRarity.Legendary;
        } else if (randomValue <= legendaryDropRate + epicDropRate) {
            return LootRarity.Epic;
        } else if (randomValue <= legendaryDropRate + epicDropRate + rareDropRate) {
            return LootRarity.Rare;
        } else {
            return LootRarity.Common;
        }
    }
    
    private void GiveRewardToPlayer(LootBoxReward reward) {
        switch (reward.type) {
            case LootRewardType.Coins:
                PlayerCurrency.AddCoins(reward.amount);
                break;
            case LootRewardType.Gems:
                PlayerCurrency.AddGems(reward.amount);
                break;
            case LootRewardType.Skin:
                FindObjectOfType<SkinManager>()?.UnlockSkin(reward.itemId);
                break;
            case LootRewardType.WeaponSkin:
                FindObjectOfType<WeaponSkinManager>()?.UnlockWeaponSkin(reward.itemId);
                break;
            case LootRewardType.Consumable:
                FindObjectOfType<ConsumableManager>()?.AddConsumable(reward.itemId, reward.amount);
                break;
        }
    }
    
    public int GetLootBoxCount(string lootBoxId) {
        return lootBoxInventory.ContainsKey(lootBoxId) ? lootBoxInventory[lootBoxId] : 0;
    }
    
    private void LoadLootBoxInventory() {
        // Simplified loading
        lootBoxInventory["basic_loot_box"] = PlayerPrefs.GetInt("BasicLootBoxes", 0);
        lootBoxInventory["premium_loot_box"] = PlayerPrefs.GetInt("PremiumLootBoxes", 0);
    }
    
    private void SaveLootBoxInventory() {
        foreach (var kvp in lootBoxInventory) {
            PlayerPrefs.SetInt(kvp.Key.Replace("_", "").ToTitleCase() + "s", kvp.Value);
        }
        PlayerPrefs.Save();
    }
}

[System.Serializable]
public class LootBoxType {
    public string id;
    public string name;
    public int guaranteedRewardCount;
    public List<PossibleLootReward> possibleRewards;
}

[System.Serializable]
public class PossibleLootReward {
    public string id;
    public string name;
    public LootRewardType type;
    public LootRarity rarity;
    public int minAmount;
    public int maxAmount;
    public string itemId;
}

[System.Serializable]
public class LootBoxReward {
    public string id;
    public string name;
    public LootRewardType type;
    public LootRarity rarity;
    public int amount;
    public string itemId;
}

public enum LootRewardType {
    Coins,
    Gems,
    Skin,
    WeaponSkin,
    Consumable
}

public enum LootRarity {
    Common,
    Rare,
    Epic,
    Legendary
}`
    }
  ];

  const [selectedFile, setSelectedFile] = useState(codebaseFiles[0]);

  // For demo purposes - no actual filtering
  const filteredFiles = codebaseFiles;
  const filteredEntities = gameEntities;

  const startAddingEntity = () => {
    setEntityForm({
      name: '',
      type: 'currency',
      description: '',
      minPrice: '',
      maxPrice: '',
      definedInFile: ''
    });
    setSelectedEntity(null);
    setIsEditing(true);
  };

  const selectEntity = (entityId: string) => {
    const entity = gameEntities.find(e => e.id === entityId);
    if (entity) {
      setEntityForm({
        name: entity.name,
        type: entity.type,
        description: entity.description,
        minPrice: entity.minPrice,
        maxPrice: entity.maxPrice,
        definedInFile: entity.definedInFile
      });
      setSelectedEntity(entityId);
      setIsEditing(true);
    }
  };

  const saveEntity = () => {
    if (!entityForm.name.trim()) return;
    
    const entityColors = [
      'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300',
      'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300', 
      'bg-gradient-to-br from-green-400 to-green-600 border-green-300',
      'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300',
      'bg-gradient-to-br from-red-400 to-red-600 border-red-300',
      'bg-gradient-to-br from-indigo-400 to-indigo-600 border-indigo-300'
    ];
    
    if (selectedEntity) {
      // Update existing entity
      setGameEntities(prev => prev.map(entity => 
        entity.id === selectedEntity 
          ? { ...entity, ...entityForm }
          : entity
      ));
    } else {
      // Add new entity
      const entityId = entityForm.name.toLowerCase().replace(/\s+/g, '_');
      const newGameEntity = {
        id: entityId,
        name: entityForm.name,
        type: entityForm.type,
        definedInFile: entityForm.definedInFile,
        description: entityForm.description,
        minPrice: entityForm.minPrice,
        maxPrice: entityForm.maxPrice,
        codeRef: '',
        color: entityColors[gameEntities.length % entityColors.length]
      };
      
      setGameEntities(prev => [...prev, newGameEntity]);
      setSelectedEntity(entityId);
    }
    
    setIsEditing(false);
  };

  const deleteEntity = (entityId: string) => {
    setGameEntities(prev => prev.filter(entity => entity.id !== entityId));
    if (selectedEntity === entityId) {
      setSelectedEntity(gameEntities[0]?.id || null);
    }
  };

  const getEntityIcon = (entityName: string, entityType: string) => {
    const name = entityName.toLowerCase();
    const type = entityType.toLowerCase();
    
    // Specific entity icons based on name
    if (name.includes('gem')) return <HiStar className="w-6 h-6 text-purple-500" />;
    if (name.includes('coin')) return <HiCurrencyDollar className="w-6 h-6 text-yellow-500" />;
    if (name.includes('skin') && name.includes('rare')) return <HiColorSwatch className="w-6 h-6 text-blue-500" />;
    if (name.includes('skin') && name.includes('epic')) return <HiSparkles className="w-6 h-6 text-indigo-500" />;
    if (name.includes('weapon') && name.includes('skin')) return <HiCubeTransparent className="w-6 h-6 text-red-500" />;
    if (name.includes('health') || name.includes('potion')) return <HiHeart className="w-6 h-6 text-green-500" />;
    if (name.includes('energy') || name.includes('drink')) return <HiLightningBolt className="w-6 h-6 text-orange-500" />;
    if (name.includes('xp') || name.includes('booster')) return <HiBadgeCheck className="w-6 h-6 text-cyan-500" />;
    if (name.includes('battle') && name.includes('pass')) return <HiBadgeCheck className="w-6 h-6 text-emerald-500" />;
    if (name.includes('loot') || name.includes('box')) return <HiGift className="w-6 h-6 text-violet-500" />;
    
    // Fallback to type-based icons
    if (type === 'currency') return <HiCurrencyDollar className="w-6 h-6 text-yellow-500" />;
    if (type === 'cosmetic') return <HiColorSwatch className="w-6 h-6 text-blue-500" />;
    if (type === 'progression') return <HiBadgeCheck className="w-6 h-6 text-green-500" />;
    if (type === 'consumable') return <HiHeart className="w-6 h-6 text-red-500" />;
    
    // Default icon
    return <HiGift className="w-6 h-6 text-gray-500" />;
  };

  const selectedEntityData = gameEntities.find(e => e.id === selectedEntity);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Entity Management */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-2 bg-purple-300">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-bold text-black">🎮 Entity Definition</h1>
            
            {/* Search */}
            <div className="relative w-48">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search entities..."
                className="w-full pl-8 pr-3 py-1 border border-black rounded-md focus:ring-1 focus:ring-purple-400 focus:border-purple-400 text-xs"
                value={searchEntities}
                onChange={(e) => setSearchEntities(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Entity Form */}
          {isEditing && (
            <div className="bg-purple-100 rounded-xl p-6 mb-6 border-2 border-black">
              <h3 className="font-bold text-black mb-4 text-lg">
                {selectedEntity ? '✏️ Edit Entity' : '✨ Create New Entity'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Name</label>
                    <input
                      type="text"
                      value={entityForm.name}
                      onChange={(e) => setEntityForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Premium Gems"
                      className="w-full px-4 py-3 border-2 border-black rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Type</label>
                    <select
                      value={entityForm.type}
                      onChange={(e) => setEntityForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-black rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                    >
                      <option value="currency">💰 Currency</option>
                      <option value="cosmetic">🎨 Cosmetic</option>
                      <option value="progression">⚡ Progression</option>
                      <option value="consumable">🍎 Consumable</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Description</label>
                  <input
                    type="text"
                    value={entityForm.description}
                    onChange={(e) => setEntityForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Premium currency for special purchases"
                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Defined in File</label>
                  <select
                    value={entityForm.definedInFile}
                    onChange={(e) => setEntityForm(prev => ({ ...prev, definedInFile: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-black rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                  >
                    <option value="">Select file...</option>
                    {codebaseFiles.map((file) => (
                      <option key={file.name} value={file.name}>
                        {file.name} - {file.path}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Min Price</label>
                    <input
                      type="text"
                      value={entityForm.minPrice}
                      onChange={(e) => setEntityForm(prev => ({ ...prev, minPrice: e.target.value }))}
                      placeholder="$0.99"
                      className="w-full px-4 py-3 border-2 border-black rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Max Price</label>
                    <input
                      type="text"
                      value={entityForm.maxPrice}
                      onChange={(e) => setEntityForm(prev => ({ ...prev, maxPrice: e.target.value }))}
                      placeholder="$4.99"
                      className="w-full px-4 py-3 border-2 border-black rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={saveEntity}
                    className="bg-purple-300 text-black px-6 py-3 rounded-lg font-bold hover:bg-purple-400 transition-colors border-2 border-black"
                  >
                    {selectedEntity ? '💾 Save Changes' : '✨ Create Entity'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors border-2 border-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Entities List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">🎯 Game Entities</h3>
              <div className="flex space-x-3">
                <button 
                  onClick={startAddingEntity}
                  className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors border-2 border-black flex items-center space-x-2"
                >
                  <HiPlusCircle className="w-4 h-4" />
                  <span>Add</span>
                </button>
                <button 
                  onClick={() => {
                    if (storeType === 'new') {
                      window.location.href = '/build';
                    } else {
                      window.location.href = '/dashboard';
                    }
                  }}
                  className="bg-purple-300 text-black px-4 py-2 rounded-lg font-bold hover:bg-purple-400 transition-colors"
                >
                  <span>{storeType === 'new' ? 'Build Store' : 'Save'}</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredEntities.map((entity) => (
                <div
                  key={entity.id}
                  onClick={() => selectEntity(entity.id)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedEntity === entity.id 
                      ? 'border-purple-300 bg-purple-100' 
                      : 'border-black bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center border-2 border-black">
                      {getEntityIcon(entity.name, entity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-black text-sm">{entity.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{entity.description}</p>
                      <div className="text-xs text-purple-600 font-medium mt-1">
                        📁 {entity.definedInFile}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="bg-white text-black px-2 py-1 rounded-full text-xs font-bold border border-black">
                          {entity.minPrice}
                        </span>
                        <span className="text-xs text-gray-400">to</span>
                        <span className="bg-white text-black px-2 py-1 rounded-full text-xs font-bold border border-black">
                          {entity.maxPrice}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="bg-purple-300 text-black px-2 py-1 rounded-full text-xs font-bold capitalize border border-black">
                          {entity.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntity(entity.id);
                      }}
                      className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-white rounded-full border border-gray-300"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Right Panel - Live Codebase Preview */}
      <div className="w-2/3 bg-white flex flex-col">
        {/* Header */}
        <div className="px-6 py-2 bg-purple-300">
          <div className="flex items-center justify-end">
            {/* Search */}
            <div className="relative w-64">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search files and code..."
                className="w-full pl-8 pr-3 py-1 border border-black rounded-md focus:ring-1 focus:ring-purple-400 focus:border-purple-400 text-xs"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* File Explorer */}
          <div className="w-64 border-r border-gray-300 bg-gray-50 overflow-y-auto">
            {/* Files Header */}
            <div className="px-3 py-2 border-b border-gray-300 bg-gray-100">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Files</span>
              </div>
            </div>
            
            {/* File Tree */}
            <div className="p-2">
              {/* Scripts Folder */}
              <div className="mb-1">
                <div className="flex items-center px-2 py-1 text-sm text-gray-700 font-medium">
                  <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  📁 Scripts
                </div>
                
                {/* Player Folder */}
                <div className="ml-4 mb-1">
                  <div className="flex items-center px-2 py-1 text-sm text-gray-700">
                    <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    📁 Player
                  </div>
                  <div
                    onClick={() => setSelectedFile(codebaseFiles[0])}
                    className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                      selectedFile.name === 'PlayerCurrency.cs' ? 'bg-purple-300 text-black' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    PlayerCurrency.cs
                  </div>
                </div>
                
                {/* Cosmetics Folder */}
                <div className="ml-4">
                  <div className="flex items-center px-2 py-1 text-sm text-gray-700">
                    <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    📁 Cosmetics
                  </div>
                  <div
                    onClick={() => setSelectedFile(codebaseFiles[1])}
                    className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                      selectedFile.name === 'SkinManager.cs' ? 'bg-purple-300 text-black' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    SkinManager.cs
                  </div>
                  <div
                    onClick={() => setSelectedFile(codebaseFiles[2])}
                    className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                      selectedFile.name === 'WeaponSkinManager.cs' ? 'bg-purple-300 text-black' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    WeaponSkinManager.cs
                  </div>
                </div>
                
                {/* Items Folder */}
                <div className="ml-4">
                  <div className="flex items-center px-2 py-1 text-sm text-gray-700">
                    <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    📁 Items
                  </div>
                  <div
                    onClick={() => setSelectedFile(codebaseFiles[3])}
                    className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                      selectedFile.name === 'ConsumableManager.cs' ? 'bg-purple-300 text-black' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    ConsumableManager.cs
                  </div>
                  <div
                    onClick={() => setSelectedFile(codebaseFiles[6])}
                    className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                      selectedFile.name === 'LootBoxManager.cs' ? 'bg-purple-300 text-black' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    LootBoxManager.cs
                  </div>
                </div>
                
                {/* Progression Folder */}
                <div className="ml-4">
                  <div className="flex items-center px-2 py-1 text-sm text-gray-700">
                    <svg className="w-3 h-3 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    📁 Progression
                  </div>
                  <div
                    onClick={() => setSelectedFile(codebaseFiles[4])}
                    className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                      selectedFile.name === 'ProgressionManager.cs' ? 'bg-purple-300 text-black' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    ProgressionManager.cs
                  </div>
                  <div
                    onClick={() => setSelectedFile(codebaseFiles[5])}
                    className={`ml-4 flex items-center px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-200 ${
                      selectedFile.name === 'BattlePassManager.cs' ? 'bg-purple-300 text-black' : 'text-gray-700'
                    }`}
                  >
                    <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    BattlePassManager.cs
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Tab Bar */}
            <div className="border-b border-gray-300 bg-gray-50">
              <div className="flex">
                <div className="flex items-center px-4 py-2 border-r border-gray-300 bg-white text-sm">
                  <svg className="w-3 h-3 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  {selectedFile.name}
                  {selectedEntity && (
                    <button
                      onClick={() => {
                        const reference = `${selectedFile.name}:${selectedFile.path}`;
                        setGameEntities(prev => prev.map(entity => 
                          entity.id === selectedEntity 
                            ? { ...entity, codeRef: reference }
                            : entity
                        ));
                      }}
                      className="ml-4 bg-purple-300 text-black px-2 py-1 rounded text-xs font-bold hover:bg-purple-400 transition-colors"
                    >
                      🔗 Map
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Code Content */}
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => navigator.clipboard.writeText(selectedFile.content)}
                  className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-800 hover:bg-gray-700 p-1.5 rounded text-xs"
                  title="Copy code"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <SyntaxHighlighter
                language="csharp"
                style={tomorrow}
                showLineNumbers={true}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '14px',
                  lineHeight: '1.5',
                  height: '100%',
                  overflow: 'auto',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                }}
                codeTagProps={{
                  style: {
                    fontSize: '14px',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    maxWidth: '100%',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }
                }}
              >
                {selectedFile.content}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}