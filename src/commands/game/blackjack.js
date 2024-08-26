import { ActionRowBuilder, EmbedBuilder } from '@discordjs/builders';
import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageCollector, InteractionCollector } from 'discord.js';
import mongodb from '../../data/db-context.js';

// TODO: implement on message delete event handler.
// need to clear data from mongodb if messages are deleted, or collectors timeout or other scenarios.
// not mission critical, but more convenient than clearing dbs every now and then by hand.

const collectionName = 'blackjack'; // TEMP or other solution

const command = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Start a blackjack session!'),

  async execute(interaction) {
    if (!mongodb.connected) {
      console.log("DB CONTEXT REQUIRED FOR THIS COMMAND"); // TODO: interaction response
      return;
    }

    const joinButton = new ButtonBuilder()
      .setCustomId('join')
      .setLabel('Join table')
      .setStyle(ButtonStyle.Primary);

    const startButton = new ButtonBuilder()
      .setCustomId('start')
      .setLabel('Start session')
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(joinButton, startButton, cancelButton);

    // TODO: Actual 'start' content
    const embed = new EmbedBuilder()
      .setTitle(`Foobar`)
      .setDescription(`Barfoo`);

    const response = await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    mongodb.createOrUpdateAsync(collectionName, interaction.id, {
      players: [],
      // TODO: gamestate 'not started'
    });


    // Handle events
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 3_600_000
    });

    const handlers = {
      'join': join,
      'start': start,
      'cancel': cancel,
    };

    collector.on('collect', async i => {
      const handler = handlers[i.customId];
      try {
        handler(i);
      }
      catch (error) {
        await i.reply({
          content: `ERROR: BLACKJACK: ${error}`,
          ephemeral: true
        });
      }
    });
  },
}

async function join(interaction) {
  var originalInteraction = interaction.message.interaction;
  const game = await mongodb.getAsync(collectionName, originalInteraction.id);

  if (game.players.find(player => player.id === interaction.user.id)) {
    interaction.reply({
      content: "you're already in the game dumbo",
      ephemeral: true
    });
  }
  else {
    game.players.push(
      {
        id: interaction.user.id,
        name: interaction.user.displayName
      }
    );

    await mongodb.createOrUpdateAsync(collectionName, originalInteraction.id, game);
    
    const players = game.players.map(player => `- ${player.name}\n`);
    const embed = new EmbedBuilder()
      .setTitle(`Current players: `)
      .setDescription(`${players}`);

    interaction.message.edit({
      embeds: [embed]
    });

    interaction.reply({
      content: "joined game",
      ephemeral: true,
    });
  }
}

function start(interaction) {
  // start game loop

  // shuffle deck

  // draw

  // render buttons, hit stand stop

  // new collector here for gameloop events?


  // original interaction id
  var originalInteractionId = interaction.message.interaction.id;
  mongodb.createOrUpdateAsync(collectionName, originalInteractionId,
    {
      name: "Start"
    }
  );

  interaction.reply({
    content: 'start clickeroo',
    ephemeral: true
  });
}

function cancel(interaction) {

  // shared stop game function?

  // original interaction id
  var originalInteractionId = interaction.message.interaction.id;
  mongodb.createOrUpdateAsync(collectionName, originalInteractionId,
    {
      name: "cancel"
    }
  );

  interaction.reply({
    content: 'cancel clickeroo',
    ephemeral: true
  });
}

export default command;