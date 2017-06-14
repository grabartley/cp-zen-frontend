import EventsService from '@/events/service';
import Vue from 'vue';

describe('Events Service', () => {
  const sandbox = sinon.sandbox.create();
  afterEach(() => {
    sandbox.restore();
  });
  const expectedEvents = [
    {
      id: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
      name: 'My First Amazing Event',
      dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
      dates: [
        {
          startTime: '2017-06-06T16:30:00.000Z',
          endTime: '2017-06-06T18:00:00.000Z',
        },
      ],
    },
    {
      id: '34174952-8ca4-4189-b8cb-d383e3fde992',
      name: 'My Second Amazing Event',
      dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
      dates: [
        {
          startTime: '2017-06-06T16:30:00.000Z',
          endTime: '2017-06-06T18:00:00.000Z',
        },
      ],
    },
  ];

  it('should get dojo events', (done) => {
    const postMock = sandbox.stub(Vue.http, 'post');
    postMock.withArgs(
      `${Vue.config.apiBase}/events/search`,
      {
        query: {
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
        },
      }).returns(Promise.resolve({ body: expectedEvents }));

    EventsService.loadEvents('3ed47c6d-a689-46a0-883b-1f3fd46e9c77').then((events) => {
      expect(events.body).to.deep.equal(expectedEvents);
      const mockCall = postMock.getCall(0).args[0];
      expect(mockCall).to.equal(`${Vue.config.apiBase}/events/search`);
      done();
    });
  });

  it('should get specific event details by id', (done) => {
    const eventId = 1;
    const getMock = sandbox.stub(Vue.http, 'get');
    getMock.withArgs(`${Vue.config.apiBase}/events/${eventId}`)
      .returns(Promise.resolve({ body: expectedEvents[0] }));

    EventsService.loadEvent(eventId).then((event) => {
      expect(event.body).to.deep.equal(expectedEvents[0]);
      done();
    });
  });

  it('should get specific event sessions by id', (done) => {
    const eventId = 1;
    const mockSessions = [
      {
        name: 'Scratch',
      },
      {
        name: 'Arduino',
      },
    ];
    const getMock = sandbox.stub(Vue.http, 'get');
    getMock.withArgs(`${Vue.config.apiBase}/events/${eventId}/sessions`)
      .returns(Promise.resolve({ body: mockSessions }));

    EventsService.loadSessions(eventId).then((sessions) => {
      expect(sessions.body).to.deep.equal(mockSessions);
      done();
    });
  });

  it('should bookTickets ', (done) => {
    // ARRANGE
    const mockUser = {
      id: '74afa4b8-8449-46e4-a553-8febda8614ad',
    };

    const mockSelectedEvent = {
      dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
      id: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
      sessions: [
        {
          id: '69624aec-e254-4636-b4c6-f623fdb0421b',
          tickets: [
            {
              id: '7c6d2cb7-0344-4cfd-8808-c0cfebbbe5af',
              name: 'Parent',
              type: 'parent-guardian',
            },
          ],
        },
      ],
    };

    const mockSelectedSessionTickets = {
      '69624aec-e254-4636-b4c6-f623fdb0421b': {
        '7c6d2cb7-0344-4cfd-8808-c0cfebbbe5af': 1,
      },
    };

    const payload = {
      applications: [
        {
          dojoId: '3ed47c6d-a689-46a0-883b-1f3fd46e9c77',
          eventId: 'd206004a-b0ce-4267-bf07-133e8113aa1b',
          sessionId: '69624aec-e254-4636-b4c6-f623fdb0421b',
          ticketName: 'Parent',
          ticketType: 'parent-guardian',
          ticketId: '7c6d2cb7-0344-4cfd-8808-c0cfebbbe5af',
          userId: '74afa4b8-8449-46e4-a553-8febda8614ad',
          notes: 'N/A',
          emailSubject: {
            received: 'foo',
            approved: 'bar',
          },
        },
      ],
    };

    const mockResponse = [];

    const postMock = sandbox.stub(Vue.http, 'post');
    postMock.withArgs(`${Vue.config.apiBase}/events/bulk-apply-applications`,
      payload).returns(Promise.resolve({ body: [] }));


    // ACT
    EventsService.bookTickets(
      mockUser, mockSelectedEvent, mockSelectedSessionTickets)
      .then((result) => {
        expect(result.body).to.deep.equal(mockResponse);
        done();
      });
  });
});
