const { ActionRowBuilder, EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageCollector, InteractionCollector } = require("discord.js");
const { mongodb } = require('../../data/db-context');


// TODO: implement on message delete event handler.
// need to clear data from mongodb if messages are deleted, or collectors timeout or other scenarios.
// not mission critical, but more convenient than clearing dbs every now and then by hand.

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Start a blackjack session!'),

  async execute(interaction) {
    if(!mongodb.connected) {
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

    const embed = new EmbedBuilder()
      .setTitle(`Foobar`)
      .setDescription(`Barfoo`);

    const response = await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 3_600_000
    });

    const handlers = {
      'join': join,
      'start': start,
      'cancel': cancel,
    }

    collector.on('collect', async i => {
      const handler = handlers[i.customId];
      try {
        handler(i);
      }
      catch (error) {
        await i.reply({
          content: `Unknown interaction.`,
          ephemeral: true
        });
      }
    });
  },
}

function join(interaction) {
  // no duplicates
  // if(stateholder.players.exists(interaction.user))
  //   interaction.reply("you're already in the game");

  // add user to mongodb blackjack game based on original interaction id

  var originalInteractionId = interaction.message.interaction.id;
  mongodb.createOrUpdateAsync('blackjack', originalInteractionId, 
    {
      name: "Join"
    }
  );

  interaction.reply({
    content: 'join clickeroo',
    ephemeral: true
  });
}

function start(interaction) {
  // start game loop

  // shuffle deck

  // draw

  // render buttons, hit stand stop

  // new collector here for gameloop events?
  

  // original interaction id
  var originalInteractionId = interaction.message.interaction.id;
  mongodb.createOrUpdateAsync('blackjack', originalInteractionId, 
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
  mongodb.createOrUpdateAsync('blackjack', originalInteractionId, 
    {
      name: "cancel"
    }
  );

  interaction.reply({
    content: 'cancel clickeroo',
    ephemeral: true
  });
}