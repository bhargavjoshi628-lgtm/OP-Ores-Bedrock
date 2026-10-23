
import { world, ItemStack } from "@minecraft/server";

const commonRewards = [
  { id: "minecraft:diamond", min: 4, max: 16 },
  { id: "minecraft:emerald", min: 8, max: 32 },
  { id: "minecraft:gold_ingot", min: 8, max: 32 },
  { id: "minecraft:iron_ingot", min: 16, max: 48 },
  { id: "minecraft:lapis_lazuli", min: 16, max: 48 },
  { id: "minecraft:redstone", min: 16, max: 48 },
  { id: "minecraft:coal", min: 16, max: 48 },
  { id: "minecraft:copper_ingot", min: 16, max: 48 },
  { id: "minecraft:amethyst_shard", min: 8, max: 32 },
  { id: "minecraft:golden_apple", min: 1, max: 4 },
  { id: "minecraft:experience_bottle", min: 8, max: 32 }
];

const rareRewards = [
  { id: "minecraft:netherite_ingot", min: 1, max: 4 },
  { id: "minecraft:enchanted_golden_apple", min: 1, max: 2 },
  { id: "minecraft:totem_of_undying", min: 1, max: 1 },
  { id: "minecraft:diamond_block", min: 2, max: 8 },
  { id: "minecraft:emerald_block", min: 4, max: 16 },
  { id: "minecraft:gold_block", min: 4, max: 16 }
];

const ores = new Set([
  "minecraft:coal_ore",
  "minecraft:deepslate_coal_ore",
  "minecraft:copper_ore",
  "minecraft:deepslate_copper_ore",
  "minecraft:iron_ore",
  "minecraft:deepslate_iron_ore",
  "minecraft:gold_ore",
  "minecraft:deepslate_gold_ore",
  "minecraft:redstone_ore",
  "minecraft:lit_redstone_ore",
  "minecraft:deepslate_redstone_ore",
  "minecraft:lit_deepslate_redstone_ore",
  "minecraft:lapis_ore",
  "minecraft:deepslate_lapis_ore",
  "minecraft:diamond_ore",
  "minecraft:deepslate_diamond_ore",
  "minecraft:emerald_ore",
  "minecraft:deepslate_emerald_ore",
  "minecraft:nether_quartz_ore",
  "minecraft:nether_gold_ore",
  "minecraft:ancient_debris"
]);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

world.afterEvents.playerBreakBlock.subscribe((event) => {
  try {
    const blockId = event.brokenBlockPermutation.type.id;

    if (!ores.has(blockId)) return;

    const isRare = Math.random() < 0.10;
    const rewards = isRare ? rareRewards : commonRewards;
    const reward = rewards[randomInt(0, rewards.length - 1)];
    const amount = randomInt(reward.min, reward.max);

    const location = event.block.location;
    const item = new ItemStack(reward.id, amount);

    event.dimension.spawnItem(item, {
      x: location.x + 0.5,
      y: location.y + 0.5,
      z: location.z + 0.5
    });

    event.player.sendMessage(
      isRare
        ? `§d§lRARE BONUS! §r§f${amount}x ${reward.id.replace("minecraft:", "")}`
        : `§aOP Ores Bonus: §f${amount}x ${reward.id.replace("minecraft:", "")}`
    );
  } catch (error) {
    console.warn(`OP Ores error: ${error}`);
  }
});

world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    event.player.sendMessage(
      "§aOP Ores enabled! §fBreak an ore to get a random bonus."
    );
  }
});
