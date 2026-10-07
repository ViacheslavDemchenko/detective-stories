(() => {
  'use strict';

  const SAVE_KEY = 'detective-mayak-case-v3';
  const LEGACY_SAVE_KEY = 'detective-mayak-case-v2';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const uniq = arr => [...new Set(arr)];

  const groups = {
    lighthouse:{title:'Маяк',hotspot:{x:29,y:5,w:13,h:23},places:['central1','communications','technical','archive']},
    weatherStation:{title:'Метеостанция',hotspot:{x:71,y:15,w:13,h:17},places:['weather']},
    guestHouse:{title:'Гостевой дом',hotspot:{x:58,y:42,w:23,h:22},places:['guestHall','kirillRoom','maximRoom','sofiaRoom']},
    pier:{title:'Причал',hotspot:{x:6,y:36,w:23,h:20},places:['pier']},
    service:{title:'Служебная зона',hotspot:{x:29,y:65,w:23,h:18},places:['generator','fuelStorage']}
  };

  const places = {
    central1:{title:'Центральный зал',img:'assets/cases/mayak/locations/central-1.png',desc:'Центральный зал маяка. Фон локации остаётся постоянным на всех этапах расследования.'},
    communications:{title:'Комната связи',img:'assets/cases/mayak/locations/communications.png',desc:'Рабочее место Ирины и оборудование связи.'},
    technical:{title:'Техническая комната',img:'assets/cases/mayak/locations/technical.png',desc:'Автоматика маяка, шкафы управления и технические следы.'},
    archive:{title:'Архив',img:'assets/cases/mayak/locations/archive.png',desc:'Старые документы, журналы и история острова.'},
    weather:{title:'Метеостанция',img:'assets/cases/mayak/locations/weather.png',desc:'Анна Ветрова, погодные записи и штормовые данные.'},
    guestHall:{title:'Общий зал гостевого дома',img:'assets/cases/mayak/locations/guest-hall.png',desc:'Максим Руднев и Софья Ланская.'},
    kirillRoom:{title:'Комната Кирилла',img:'assets/cases/mayak/locations/kirill-room.png',desc:'Личные вещи и рабочие материалы Кирилла.'},
    maximRoom:{title:'Комната Максима',img:'assets/cases/mayak/locations/maxim-room.png',desc:'Личные и деловые материалы Максима.'},
    sofiaRoom:{title:'Комната Софьи',img:'assets/cases/mayak/locations/sofia-room.png',desc:'Фотографии и заметки Софьи.'},
    pier:{title:'Причал',img:'assets/cases/mayak/locations/pier.png',desc:'Олег, катер и камера причала.'},
    generator:{title:'Генераторная',img:'assets/cases/mayak/locations/generator.png',desc:'Резервное питание маяка.'},
    fuelStorage:{title:'Топливный склад',img:'assets/cases/mayak/locations/fuel-storage.png',desc:'Запасы топлива и складской учёт.'}
  };

  const evidenceDefs = {
    ev_stepan_log_edit:{title:'Исправленный журнал Степана',desc:'В журнале изменено время одной из прежних контрольных проверок.',icon:'▤',related:['stepan']},
    ev_automation_cabinet:{title:'Технический шкаф автоматики',desc:'Следов взлома нет: шкаф открывали штатным способом.',icon:'▣',related:['stepan','kirill','irina']},
    ev_service_jumper:{title:'Сервисная перемычка',desc:'Штатный инструмент, позволяющий перевести автоматику в локальный сервисный режим.',icon:'⌁',related:['kirill','stepan','irina']},
    ev_automation_log:{title:'Журнал автоматики',desc:'21:45:54 — открыт шкаф; 21:46:08 — сервисный режим; 21:46:41 — изменён порог защиты; 21:47:12 — отключён автоматический перезапуск; 21:48:19 — шкаф закрыт.',icon:'≡',related:['kirill','stepan','irina']},
    ev_empty_module_slot:{title:'Пустой слот диагностического модуля',desc:'Диагностический модуль отсутствует в штатном месте.',icon:'□',related:['kirill','stepan','irina']},
    ev_old_controller:{title:'Старый контроллер маяка',desc:'Маркировка и серийный номер позволяют найти его техническую историю в архиве.',icon:'▧',related:['kirill']},
    ev_low_reserve_tank:{title:'Почти пустой резервный топливный бак',desc:'Запаса недостаточно для нормальной работы резервного генератора.',icon:'◒',related:['oleg','stepan']},
    ev_generator_log:{title:'Журнал резервного генератора',desc:'22:18 — команда запуска получена, затем давление топлива падает и двигатель останавливается.',icon:'↯',related:['oleg','stepan']},
    ev_fuel_barrels:{title:'Топливные бочки',desc:'Фактический остаток на складе заметно меньше ожидаемого.',icon:'◉',related:['oleg']},
    ev_fuel_ledger:{title:'Журнал учёта топлива',desc:'По документам топлива должно быть больше, чем есть на складе и в резерве.',icon:'▤',related:['oleg','stepan']},
    ev_fuel_dispense_trace:{title:'Следы недавней выдачи топлива',desc:'Оборудование выдачи использовали недавно; нехватка не похожа на простую утечку.',icon:'⌁',related:['oleg']},
    ev_pier_camera:{title:'Запись камеры на причале',desc:'Олег непрерывно находится на причале с 21:43 до 21:52.',icon:'◫',related:['oleg']},
    ev_stepan_radio:{title:'Радиозапись Степана',desc:'Стационарная радиостанция фиксирует работу Степана с 21:43 до 21:51.',icon:'⌁',related:['stepan']},
    ev_irina_session:{title:'Сеанс связи Ирины',desc:'Стационарный терминал использовался Ириной с 21:44 до 21:51.',icon:'⌨',related:['irina']},
    ev_maxim_sat_session:{title:'Спутниковый сеанс Максима',desc:'Стационарный спутниковый терминал фиксирует разговор Максима с 21:42 до 21:51.',icon:'◌',related:['maxim']},
    ev_weather_log:{title:'Журнал Метеостанции',desc:'Ручные операции Анны идут с 21:45:21 до 21:49:06.',icon:'☁',related:['anna']},
    ev_anna_materials:{title:'Материалы Анны о старом кораблекрушении',desc:'Подборка архивных сведений показывает её личный интерес к старой катастрофе.',icon:'▤',related:['anna']},
    ev_modernization_docs:{title:'Проект модернизации маяка',desc:'Аварийное состояние объекта могло ускорить проект, в котором участвует компания Максима.',icon:'▤',related:['maxim']},
    ev_old_inspection_act:{title:'Прошлогодний акт технической проверки',desc:'Кирилл подписал документ об отсутствии критических неисправностей.',icon:'▤',related:['kirill']},
    ev_old_error_archive:{title:'Архив диагностических ошибок',desc:'Контроллер фиксировал проблемы ещё до прошлогодней проверки Кирилла.',icon:'≡',related:['kirill']},
    ev_archive_access_log:{title:'Журнал доступа в архив',desc:'21:41 — вход Софьи; 21:52 — выход. Между этими отметками дверь не открывалась.',icon:'▤',related:['sofia']},
    ev_old_wreck_docs:{title:'Документы старой катастрофы',desc:'Материалы о кораблекрушении связывают второстепенные линии Анны и Софьи.',icon:'▤',related:['anna','sofia']},
    ev_sofia_photos:{title:'Фотографии Софьи из архива',desc:'Снимки имеют отметки 21:45, 21:47 и 21:49.',icon:'▧',related:['sofia']},
    ev_sofia_notes:{title:'Личные записи Софьи',desc:'Записи раскрывают связь Софьи с бывшим смотрителем маяка.',icon:'▤',related:['sofia']},
    ev_kirill_work_docs:{title:'Рабочие документы Кирилла',desc:'Подтверждают квалификацию, знание сервисного режима и полномочия работать с контроллером.',icon:'▤',related:['kirill']},
    ev_kirill_module:{title:'Диагностический модуль в кейсе Кирилла',desc:'Пропавший из шкафа модуль найден среди личных вещей Кирилла.',icon:'▣',related:['kirill']}
  };
  // Изображения улик «Маяка». Материалы дела используют тот же визуальный
  // принцип, что и «Семейный рецепт»: найденная улика показывает реальную
  // миниатюру, а символ остаётся резервным вариантом для служебных карточек.
  function evidenceVisual(id, fallbackIcon='?'){
    const src=`assets/cases/mayak/evidence/${id}.png`;
    return evidenceDefs[id]
      ? `<img class="evidence-thumb" src="${src}" alt="">`
      : `<span class="evidence-thumb-fallback">${fallbackIcon}</span>`;
  }



  const suspects = {
    stepan:{
      name:'Степан', role:'смотритель маяка', mood:'Насторожен', status:'Свидетель', portrait:'assets/cases/mayak/characters/stepan.png',
      topics:[
        {id:'failure',required:true,type:'start',label:'Что произошло в 22:17?',text:`«В 22:17 погас основной огонь. Я сразу пошёл к щиту. Резерв должен был подхватить питание автоматически, но этого не произошло. При таком шторме первым делом думаешь на автоматику».`,grants:['st_stepan_failure']},
        {id:'reserve',type:'unlock',label:'Почему не запустился резерв?',requires:{all:['st_stepan_failure']},text:`«Не знаю. Резерв проверяли, по журналу он был исправен. Даже если основная линия отключилась, генератор должен был запуститься. Два отказа подряд — слишком много для одного совпадения».`,grants:['st_stepan_reserve_should_start']},
        {id:'access',type:'start',label:'Кто имел доступ к автоматике?',requires:{all:['stage_map_open']},text:`«Постоянный доступ есть у меня. Ирина работает со связью и частью служебных систем. Кириллу на время проверки дали полный технический доступ. Остальным в шкаф автоматики делать нечего».`,grants:['st_stepan_access']},
        {id:'journal',type:'present',label:'Почему в журнале исправлена запись?',requires:{all:['ev_stepan_log_edit']},text:`«Потому что я пропустил одну контрольную проверку. Потом исправил время обхода, чтобы не объясняться с управлением. Да, нарушение. Но это было раньше и к нынешнему отключению отношения не имеет».`,grants:['st_stepan_log_confession']},
        {id:'criticalTime',type:'unlock',label:'Где вы были с 21:46 до 21:48?',requires:{all:['cl_sabotage_time']},text:`«В Комнате связи. Работал по стационарной радиостанции. Был сеанс с материком. Запись должна сохраниться».`,grants:['st_stepan_critical_time']},
        {id:'radioConfirm',type:'present',label:'Радиозапись подтверждает ваши слова',requires:{all:['st_stepan_critical_time','ev_stepan_radio']},text:`«Вот и всё. В это время я находился у передатчика. Оттуда до технического шкафа я никак не мог добраться незаметно».`,grants:['st_stepan_radio_confirm']},
        {id:'module',type:'present',label:'Куда делся диагностический модуль?',requires:{all:['ev_empty_module_slot']},text:`«Его нет? Тогда это уже совсем плохо. Модуль должен постоянно стоять в шкафу. Там хранится диагностика контроллера. После аварии первым с автоматикой работал Кирилл».`,grants:['st_stepan_module_info']}
      ]
    },
    kirill:{
      name:'Кирилл Логинов', role:'инженер', mood:'Собран', status:'Свидетель', portrait:'assets/cases/mayak/characters/kirill.png',
      topics:[
        {id:'cause',required:true,type:'start',label:'Ваша версия аварии',text:`«Похоже на скачок нагрузки во время шторма. Защита отключила основную линию. После этого резервная система могла уйти в аварийный режим. Для старого оборудования ничего невозможного здесь нет».`,grants:['st_kirill_natural_failure']},
        {id:'where',type:'start',label:'Где вы были, когда погас маяк?',text:`«В Центральном зале, вместе с остальными. К технической комнате я подошёл уже после тревоги».`,grants:['st_kirill_2217_alibi']},
        {id:'inspection',type:'start',label:'Когда вы последний раз проверяли автоматику?',text:`«Перед ухудшением погоды. Ничего критического не увидел. Если хотите понять причину отключения, смотрите системный журнал. Он надёжнее любых воспоминаний».`,grants:['st_kirill_last_check']},
        {id:'jumper',type:'present',label:'Здесь использовали сервисную перемычку',requires:{all:['ev_service_jumper']},text:`«Это штатный инструмент обслуживания. Её используют при диагностике. Сама оказаться там она, разумеется, не могла».`,grants:['st_kirill_jumper_explanation']},
        {id:'manualChanges',type:'present',label:'Параметры системы изменили вручную',requires:{all:['ev_automation_log']},text:`«Тогда версия обычного отказа действительно становится сомнительной. Да, такие команды вводятся непосредственно у шкафа».`,grants:['st_kirill_local_intervention']},
        {id:'criticalTime',type:'unlock',label:'Где вы были с 21:46 до 21:48?',requires:{all:['cl_sabotage_time']},text:`«Точно по минутам? Не вспомню. Ходил между гостевым домом и техническим блоком, готовился к вечерней проверке. Вряд ли кто-то следил за мной».`,grants:['st_kirill_critical_time']},
        {id:'moduleWhere',type:'present',label:'Где диагностический модуль?',requires:{all:['ev_empty_module_slot']},text:`«После аварии я снимал его для диагностики. Потом оставил возле оборудования. Возможно, кто-то переложил».`,grants:['st_kirill_module_location']},
        {id:'oldAct',type:'present',label:'Вы подписывали прошлогодний акт?',requires:{all:['ev_old_inspection_act']},text:`«Да. Это моя подпись. На момент проверки запись соответствовала результатам диагностики».`,grants:['st_kirill_old_act']},
        {id:'oldErrors',type:'present',label:'Ошибки существовали ещё тогда',requires:{all:['ev_old_error_archive','st_kirill_old_act']},text:`«Были отдельные предупреждения. Они не означали неизбежного отказа, поэтому я не считал их критическими».`,grants:['st_kirill_old_errors_response']},
        {id:'upcomingCheck',type:'unlock',label:'Завтрашняя проверка могла это обнаружить?',requires:{all:['cl_kirill_hid_faults']},text:`«Проверка могла поднять старые журналы. И что с того? Если старый контроллер признали бы аварийным, его всё равно пришлось бы менять».`,grants:['st_kirill_upcoming_check']},
        {id:'moduleCase',type:'present',label:'Почему модуль оказался в вашем кейсе?',requires:{all:['ev_kirill_module','st_kirill_module_location']},text:`«Я собирался проверить его позже. Если раньше сказал, что оставил модуль возле шкафа, значит, вспомнил неправильно».`,grants:['st_kirill_module_confronted']}
      ]
    },
    maxim:{
      name:'Максим Руднев', role:'инвестор', mood:'Сдержан', status:'Свидетель', portrait:'assets/cases/mayak/characters/maxim.png',
      topics:[
        {id:'purpose',type:'start',label:'Зачем вы приехали на остров?',text:`«Мы обсуждаем модернизацию комплекса. Я приехал посмотреть объект и понять объём возможных работ».`,grants:['st_maxim_reason']},
        {id:'alibi',required:true,type:'start',label:'Где вы были во время отключения?',text:`«Когда маяк погас, я уже был в Центральном зале. До этого разговаривал с материком через стационарный спутниковый терминал в Комнате связи. Сам разговор можно проверить».`,grants:['st_maxim_2217']},
        {id:'gain',type:'start',label:'Вам выгодна авария?',text:`«Мне выгоден проект модернизации. Это правда. Если объект признают аварийным, решение могут принять быстрее. Но между выгодой и саботажем большая разница».`,grants:['st_maxim_financial_interest']},
        {id:'docs',type:'present',label:'Документы подтверждают вашу заинтересованность',requires:{all:['ev_modernization_docs']},text:`«Я этого не отрицал. Моя компания участвует в переговорах, и аварийное состояние объекта действительно ускорило бы обсуждение проекта».`,grants:['st_maxim_docs_confirm']},
        {id:'criticalTime',type:'unlock',label:'Где вы были с 21:46 до 21:48?',requires:{all:['cl_sabotage_time']},text:`«У спутникового терминала. Разговор начался примерно в 21:42 и закончился около 21:51. Терминал стационарный».`,grants:['st_maxim_critical_time']},
        {id:'satConfirm',type:'present',label:'Журнал терминала подтверждает ваш разговор',requires:{all:['st_maxim_critical_time','ev_maxim_sat_session']},text:`«Значит, этот вопрос закрыт. Я не мог одновременно находиться у технического шкафа».`,grants:['st_maxim_sat_confirm']}
      ]
    },
    irina:{
      name:'Ирина',role:'техник связи',mood:'Собрана',status:'Свидетель',portrait:'assets/cases/mayak/characters/irina.png',
      topics:[
        {id:'role',type:'start',label:'За что вы отвечаете на маяке?',requires:{all:['stage_map_open']},text:`«Связь, телеметрия, часть систем наблюдения. К силовой автоматике я обычно не лезу».`,grants:['st_irina_role']},
        {id:'access',type:'start',label:'У вас есть доступ в Техническую комнату?',requires:{all:['stage_map_open']},text:`«Войти могу. Работать с контроллером самостоятельно — нет. Для этого есть отец и приглашённый инженер».`,grants:['st_irina_access']},
        {id:'conflict',type:'start',label:'Почему вы спорили со Степаном?',requires:{all:['stage_map_open']},text:`«Он слишком привык доверять старому оборудованию. Маяк давно нужно модернизировать, а отец воспринимает любые разговоры об этом как личное обвинение».`,grants:['st_irina_conflict']},
        {id:'criticalTime',type:'unlock',label:'Где вы были с 21:46 до 21:48?',requires:{all:['cl_sabotage_time']},text:`«В Комнате связи. Занималась служебной передачей. Это не связано с аварией».`,grants:['st_irina_critical_time']},
        {id:'session',type:'present',label:'Терминал зафиксировал вашу передачу',requires:{all:['st_irina_critical_time','ev_irina_session']},text:`«Да. С 21:44 до 21:51 я передавала пакет данных в управление».`,grants:['st_irina_session_confirm']},
        {id:'secretReport',type:'unlock',label:'Что было в пакете данных?',requires:{all:['st_irina_session_confirm']},text:`«Отчёт о состоянии маяка. И о том, как отец ведёт обслуживание. Я скрывала это, потому что отец воспринял бы отчёт как предательство».`,grants:['st_irina_secret_report']},
        {id:'module',type:'present',label:'Диагностический модуль должен быть в шкафу?',requires:{all:['ev_empty_module_slot']},text:`«Конечно. Без него система работает, но теряется часть диагностической истории. После проверки модуль всегда возвращают на место».`,grants:['st_irina_module_info']}
      ]
    },
    anna:{
      name:'Анна Ветрова',role:'метеоролог',mood:'Сосредоточена',status:'Свидетель',portrait:'assets/cases/mayak/characters/anna.png',
      topics:[
        {id:'storm',type:'start',label:'Насколько сильным был шторм?',requires:{all:['stage_map_open']},text:`«Сильным. Порывы выше обычных, давление быстро падало. Но ничего уникального для этого района».`,grants:['st_anna_storm']},
        {id:'stormCause',type:'start',label:'Шторм мог сам отключить маяк?',requires:{all:['stage_map_open']},text:`«Я метеоролог, а не инженер. Но такие условия здесь уже бывали. Сам по себе шторм не объясняет одновременно проблемы с основной системой и резервом».`,grants:['st_anna_storm_not_unique']},
        {id:'oldWreck',type:'start',label:'Почему вас интересует старая катастрофа?',requires:{all:['stage_map_open']},text:`«Я изучаю историю погодных условий на острове. Старые аварии дают хорошие данные».`,grants:['st_anna_old_wreck']},
        {id:'criticalTime',type:'unlock',label:'Где вы были с 21:46 до 21:48?',requires:{all:['cl_sabotage_time']},text:`«Здесь, на Метеостанции. Я вручную передавала наблюдения».`,grants:['st_anna_critical_time']},
        {id:'weatherConfirm',type:'present',label:'Журнал подтверждает ваши действия',requires:{all:['st_anna_critical_time','ev_weather_log']},text:`«Передачи шли одна за другой. Я физически не могла одновременно находиться возле автоматики».`,grants:['st_anna_weather_confirm']},
        {id:'materials',type:'present',label:'Это больше, чем метеорологическое исследование',requires:{all:['ev_anna_materials']},text:`«В той катастрофе погиб человек из моей семьи. Официально всё списали на шторм и ошибку смотрителя. Я хочу выяснить, что произошло на самом деле».`,grants:['st_anna_personal_connection']}
      ]
    },
    oleg:{
      name:'Олег Михайлов',role:'капитан снабженческого катера',mood:'Насторожен',status:'Свидетель',portrait:'assets/cases/mayak/characters/oleg.png',
      topics:[
        {id:'delivery',type:'start',label:'Когда вы привозили топливо?',requires:{all:['stage_map_open']},text:`«Последняя нормальная поставка была несколько дней назад. Приняли всё по ведомости».`,grants:['st_oleg_delivery']},
        {id:'responsibility',type:'start',label:'Кто отвечает за топливо?',requires:{all:['stage_map_open']},text:`«Я доставляю. На острове принимает Степан или тот, кто дежурит. Что дальше с ним происходит — не моя забота».`,grants:['st_oleg_fuel_responsibility']},
        {id:'lowTank',type:'present',label:'Почему резервный бак почти пуст?',requires:{all:['ev_low_reserve_tank']},text:`«Может, расходовали больше обычного. Генераторы, техника, катер. Если в журнале другое — значит, документы заполняли плохо».`,grants:['st_oleg_low_fuel_excuse']},
        {id:'shortage',type:'present',label:'На складе не хватает топлива',requires:{all:['ev_fuel_barrels','ev_fuel_ledger']},text:`«И что вы хотите от меня услышать? Я не знаю, кто и куда его дел».`,grants:['st_oleg_shortage_denial']},
        {id:'dispense',type:'present',label:'Оборудование выдачи недавно использовали',requires:{all:['ev_fuel_dispense_trace']},text:`«Здесь постоянно чем-то пользуются. Это ничего не доказывает».`,grants:['st_oleg_dispense_response']},
        {id:'criticalTime',type:'unlock',label:'Где вы были с 21:46 до 21:48?',requires:{all:['cl_sabotage_time']},text:`«На причале. Возился с катером. Один».`,grants:['st_oleg_critical_time']},
        {id:'camera',type:'present',label:'Камера показывает вас на причале',requires:{all:['st_oleg_critical_time','ev_pier_camera']},text:`«Я же сказал. Всё это время был на причале».`,grants:['st_oleg_camera_confirm']},
        {id:'theft',type:'present',label:'Вы похищали топливо?',requires:{all:['cl_fuel_disappearing']},text:`«Брал понемногу и продавал на материке. Не каждую поставку. Я думал, запаса всё равно хватает. Я не знал, что основной маяк отключится».`,grants:['st_oleg_theft_confession']},
        {id:'mainSabotage',type:'unlock',label:'Вы отключили основной маяк?',requires:{all:['cl_oleg_fuel_theft','cl_oleg_alibi']},text:`«Как? С причала? Я украл топливо, это правда. Но в автоматику я не лазил».`,grants:['st_oleg_main_denial']}
      ]
    },
    sofia:{
      name:'Софья Ланская',role:'журналист и краевед',mood:'Наблюдательна',status:'Свидетель',portrait:'assets/cases/mayak/characters/sofia.png',
      topics:[
        {id:'reason',type:'start',label:'Зачем вы приехали на остров?',requires:{all:['stage_map_open']},text:`«Пишу материал об истории маяка. Здесь слишком много событий, о которых на материке почти никто не помнит».`,grants:['st_sofia_reason']},
        {id:'research',type:'start',label:'Что именно вы исследуете?',requires:{all:['stage_map_open']},text:`«Историю смотрителей, старые аварии, кораблекрушения. Обычная архивная работа».`,grants:['st_sofia_research']},
        {id:'archiveDenial',type:'start',label:'Вы заходили в архив?',requires:{all:['stage_map_open']},text:`«Нет. Мне сказали, что архив закрыт для гостей».`,grants:['st_sofia_archive_denial']},
        {id:'criticalTime',type:'unlock',label:'Где вы были с 21:46 до 21:48?',requires:{all:['cl_sabotage_time']},text:`«В гостевом доме. Разбирала записи».`,grants:['st_sofia_critical_time_lie']},
        {id:'archiveLog',type:'present',label:'Дверь архива зарегистрировала ваш вход',requires:{all:['ev_archive_access_log','st_sofia_archive_denial']},text:`«Хорошо. Я была там. Разрешения у меня не было, поэтому и соврала».`,grants:['st_sofia_archive_confession']},
        {id:'lieReason',type:'unlock',label:'Почему вы солгали?',requires:{all:['st_sofia_archive_confession']},text:`«Если бы я сразу сказала правду, первым вопросом было бы не про маяк, а про то, как я попала в закрытый архив».`,grants:['st_sofia_lie_reason']},
        {id:'photos',type:'present',label:'Эти фотографии сделаны внутри архива',requires:{all:['ev_sofia_photos']},text:`«Да. На снимках стоят исходные отметки времени. Я фотографировала документы почти всё время, пока находилась внутри».`,grants:['st_sofia_photos_confirm']},
        {id:'familyLink',type:'present',label:'Почему вас интересует старая катастрофа?',requires:{all:['ev_sofia_notes']},text:`«Мой дед был смотрителем этого маяка. После той катастрофы его объявили виновным в халатности. Я хочу узнать, что произошло на самом деле».`,grants:['st_sofia_family_connection']}
      ]
    }
  };

  const introRequirements = [
    ['stepan','failure','Поговорить со Степаном о том, что произошло в 22:17.'],
    ['kirill','cause','Получить техническую версию Кирилла.'],
    ['maxim','alibi','Проверить, где находился Максим в момент отключения.']
  ];

  const conclusionDefs = {
    cl_manual_intervention:{title:'В автоматику вмешались вручную',desc:'Сервисная перемычка и журнал показывают локальное ручное вмешательство.',requires:{all:['ev_service_jumper','ev_automation_log']},related:['kirill','stepan','irina']},
    cl_sabotage_time:{title:'Саботаж произошёл с 21:45:54 до 21:48:19',desc:'Журнал автоматики фиксирует полный интервал локального вмешательства.',requires:{all:['ev_automation_log','cl_manual_intervention']},related:['kirill','stepan','irina','anna','maxim','oleg','sofia']},
    cl_main_failure_sabotage:{title:'Основной маяк отключился из-за намеренного изменения автоматики',desc:'Параметры защиты были изменены вручную до аварии.',requires:{all:['cl_manual_intervention','cl_sabotage_time']},related:['kirill']},
    cl_reserve_failed_fuel:{title:'Резервный генератор отказал из-за нехватки топлива',desc:'Генератор получил команду запуска, но остановился при падении давления топлива.',requires:{all:['ev_low_reserve_tank','ev_generator_log']},related:['oleg','stepan']},
    cl_separate_failures:{title:'Основной маяк и резерв отказали по разным причинам',desc:'Основной огонь отключён вмешательством в автоматику, резерв сорвался из-за топлива.',requires:{all:['cl_main_failure_sabotage','cl_reserve_failed_fuel']},related:['kirill','oleg']},
    cl_stepan_hidden_violation:{title:'Степан скрывал служебное нарушение',desc:'Он признал, что исправил время пропущенной контрольной проверки.',requires:{all:['ev_stepan_log_edit','st_stepan_log_confession']},related:['stepan']},
    cl_stepan_alibi:{title:'Алиби Степана доказано',desc:'Его показание подтверждает независимая запись стационарной радиостанции.',requires:{all:['cl_sabotage_time','st_stepan_critical_time','ev_stepan_radio']},related:['stepan']},
    cl_irina_secret_report:{title:'Ирина тайно отправила отчёт руководству',desc:'Она скрывала служебный отчёт о состоянии маяка и обслуживании Степана.',requires:{all:['ev_irina_session','st_irina_secret_report']},related:['irina','stepan']},
    cl_irina_alibi:{title:'Алиби Ирины доказано',desc:'Её местонахождение подтверждает стационарный терминал связи.',requires:{all:['cl_sabotage_time','st_irina_critical_time','ev_irina_session']},related:['irina']},
    cl_maxim_financial_interest:{title:'У Максима есть финансовый интерес',desc:'Его признание подтверждается документами проекта модернизации.',requires:{all:['st_maxim_financial_interest','ev_modernization_docs']},related:['maxim']},
    cl_maxim_alibi:{title:'Алиби Максима доказано',desc:'Стационарный спутниковый терминал подтверждает его местонахождение.',requires:{all:['cl_sabotage_time','st_maxim_critical_time','ev_maxim_sat_session']},related:['maxim']},
    cl_anna_personal_connection:{title:'Анна скрывала личную связь со старой катастрофой',desc:'Её интерес к старому кораблекрушению был личным, а не только профессиональным.',requires:{all:['ev_anna_materials','st_anna_personal_connection']},related:['anna']},
    cl_anna_alibi:{title:'Алиби Анны доказано',desc:'Ручные операции Метеостанции идут через весь критический интервал.',requires:{all:['cl_sabotage_time','st_anna_critical_time','ev_weather_log']},related:['anna']},
    cl_fuel_disappearing:{title:'Топливо систематически исчезало со склада',desc:'Фактический остаток, журнал и следы выдачи не согласуются между собой.',requires:{all:['ev_fuel_barrels','ev_fuel_ledger','ev_fuel_dispense_trace']},related:['oleg']},
    cl_oleg_fuel_theft:{title:'Олег систематически похищал топливо',desc:'Олег признаётся после сопоставления складских материалов.',requires:{all:['cl_fuel_disappearing','st_oleg_theft_confession']},related:['oleg']},
    cl_oleg_alibi:{title:'Алиби Олега на саботаж доказано',desc:'Камера фиксирует Олега на причале весь критический интервал.',requires:{all:['cl_sabotage_time','st_oleg_critical_time','ev_pier_camera']},related:['oleg']},
    cl_oleg_not_main_saboteur:{title:'Олег не саботировал основной маяк',desc:'Он виновен в хищении топлива, но физически не мог вмешаться в автоматику.',requires:{all:['cl_oleg_fuel_theft','cl_oleg_alibi','cl_main_failure_sabotage']},related:['oleg','kirill']},
    cl_sofia_archive_lie:{title:'Софья скрывала незаконное посещение архива',desc:'Журнал двери опровергает её первоначальное отрицание.',requires:{all:['st_sofia_archive_denial','ev_archive_access_log','st_sofia_archive_confession']},related:['sofia']},
    cl_sofia_alibi:{title:'Алиби Софьи доказано',desc:'Журнал закрытой двери и снимки с отметками времени помещают Софью в архив на весь критический интервал.',requires:{all:['cl_sabotage_time','st_sofia_critical_time_lie','ev_archive_access_log','ev_sofia_photos']},related:['sofia']},
    cl_sofia_family_connection:{title:'Софья скрывала семейную связь со старой катастрофой',desc:'Её дед был смотрителем маяка во время старого кораблекрушения.',requires:{all:['ev_sofia_notes','st_sofia_family_connection']},related:['sofia']},
    cl_kirill_access:{title:'Технический доступ Кирилла доказан',desc:'Степан подтверждает доступ, а рабочие документы показывают необходимые полномочия и квалификацию.',requires:{all:['st_stepan_access','ev_kirill_work_docs']},related:['kirill']},
    cl_kirill_no_alibi:{title:'У Кирилла нет подтверждённого алиби',desc:'На 21:46–21:48 Кирилл не может назвать независимо подтверждаемое местонахождение.',requires:{all:['cl_sabotage_time','st_kirill_critical_time']},related:['kirill']},
    cl_kirill_hid_faults:{title:'Кирилл скрыл известные проблемы старого контроллера',desc:'Прошлогодний акт противоречит архивной истории ошибок.',requires:{all:['ev_old_inspection_act','ev_old_error_archive','st_kirill_old_act']},related:['kirill']},
    cl_kirill_motive:{title:'Мотив Кирилла установлен',desc:'Предстоящая проверка могла раскрыть прошлогоднее сокрытие неисправностей.',requires:{all:['cl_kirill_hid_faults','st_kirill_upcoming_check']},related:['kirill']},
    cl_kirill_lied_module:{title:'Кирилл солгал о диагностическом модуле',desc:'Он утверждал, что оставил модуль возле шкафа, но модуль найден в его личном кейсе.',requires:{all:['ev_empty_module_slot','st_kirill_module_location','ev_kirill_module']},related:['kirill']},
    cl_kirill_module_link:{title:'Кирилл пытался скрыть диагностические данные',desc:'Пропавший модуль с историей локального вмешательства оказался у Кирилла.',requires:{all:['ev_kirill_module','ev_empty_module_slot','cl_kirill_lied_module']},related:['kirill']}
  };

  const stageDefs = {
    stage_map_open:{requires:{all:['intro_complete']}},
    stage_two_failures:{requires:{all:['cl_separate_failures']}},
    stage_sabotage_time:{requires:{all:['cl_sabotage_time']}},
    stage_alibi_check:{requires:{all:['cl_sabotage_time']}},
    stage_kirill_focus:{requires:{all:['cl_stepan_alibi','cl_irina_alibi','cl_anna_alibi','cl_maxim_alibi','cl_oleg_alibi','cl_sofia_alibi','cl_kirill_no_alibi','cl_manual_intervention']}},
    stage_false_threads_closed:{requires:{all:['cl_oleg_not_main_saboteur','cl_stepan_alibi','cl_irina_alibi','cl_anna_alibi','cl_maxim_alibi','cl_sofia_alibi']}},
    stage_final_ready:{requires:{all:[
      'cl_manual_intervention','cl_sabotage_time','cl_main_failure_sabotage','cl_reserve_failed_fuel','cl_separate_failures',
      'cl_stepan_alibi','cl_irina_alibi','cl_anna_alibi','cl_maxim_alibi','cl_oleg_alibi','cl_sofia_alibi',
      'cl_oleg_fuel_theft','cl_oleg_not_main_saboteur','cl_kirill_access','cl_kirill_no_alibi','cl_kirill_hid_faults','cl_kirill_motive',
      'ev_empty_module_slot','ev_kirill_module','cl_kirill_lied_module','cl_kirill_module_link'
    ]}}
  };

  const notebookTasks = [
    {id:'nb_intro_stepan',text:'Поговорить со Степаном о том, что произошло в 22:17.',appears:{all:[]},done:{all:['topic:stepan:failure']}},
    {id:'nb_intro_kirill',text:'Получить техническую версию Кирилла.',appears:{all:[]},done:{all:['topic:kirill:cause']}},
    {id:'nb_intro_maxim',text:'Проверить, где находился Максим в момент отключения.',appears:{all:[]},done:{all:['topic:maxim:alibi']}},
    {id:'nb_check_reserve',text:'Выяснить, почему не запустился резервный генератор.',appears:{any:['st_stepan_reserve_should_start','ev_low_reserve_tank']},done:{all:['cl_reserve_failed_fuel']}},
    {id:'nb_find_sabotage_time',text:'Установить, когда вмешались в автоматику.',appears:{all:['cl_manual_intervention']},done:{all:['cl_sabotage_time']}},
    {id:'nb_check_alibis',text:'Проверить местонахождение всех участников с 21:46 до 21:48.',appears:{all:['cl_sabotage_time']},done:{all:['cl_stepan_alibi','cl_irina_alibi','cl_anna_alibi','cl_maxim_alibi','cl_oleg_alibi','cl_sofia_alibi','cl_kirill_no_alibi']}},
    {id:'nb_fuel_shortage',text:'Выяснить, куда исчезло резервное топливо.',appears:{all:['ev_low_reserve_tank']},done:{all:['cl_oleg_fuel_theft']}},
    {id:'nb_compare_old_records',text:'Сопоставить прошлогодний акт Кирилла с историей ошибок контроллера.',appears:{all:['ev_old_inspection_act']},done:{all:['cl_kirill_hid_faults']}},
    {id:'nb_find_module',text:'Найти диагностический модуль.',appears:{all:['ev_empty_module_slot']},done:{all:['ev_kirill_module']}},
    {id:'nb_final_version',text:'Собрать доказательства против человека, вмешавшегося в автоматику.',appears:{all:['stage_kirill_focus']},done:{all:['stage_final_ready']}}
  ];

  const placeUnlockRules = {
    maximRoom:{all:['topic:maxim:gain']},
    sofiaRoom:{all:['cl_sofia_archive_lie']},
    kirillRoom:{all:['ev_empty_module_slot','st_kirill_module_location','cl_kirill_hid_faults']}
  };

  const personHotspots = {
    central1:{before:[
      {sid:'maxim',x:18,y:28,w:30,h:68},{sid:'kirill',x:37,y:12,w:21,h:55},{sid:'stepan',x:68,y:28,w:21,h:62}
    ],after:[
      {sid:'maxim',x:18,y:28,w:30,h:68},{sid:'kirill',x:37,y:12,w:21,h:55},{sid:'stepan',x:68,y:28,w:21,h:62}
    ]},
    communications:{after:[{sid:'irina',x:26,y:13,w:35,h:78}]},
    weather:{after:[{sid:'anna',x:34,y:13,w:37,h:79}]},
    guestHall:{after:[{sid:'maxim',x:24,y:8,w:28,h:82},{sid:'sofia',x:58,y:17,w:31,h:75}]},
    pier:{after:[{sid:'oleg',x:39,y:17,w:27,h:74}]}
  };

  const sceneHotspots = {
    central1:[
      {id:'hotspot_stepan_log',label:'Журнал Степана',x:57.5,y:57.5,w:8.5,h:3.7,grants:['ev_stepan_log_edit'],persistent:true,stealth:true}
    ],
    technical:[
      {id:'hotspot_cabinet',label:'Технический шкаф автоматики',x:61.0,y:27.3,w:9.7,h:18.4,grants:['ev_automation_cabinet']},
      {id:'hotspot_old_controller',label:'Старый контроллер',x:24.2,y:43.8,w:9.4,h:7.3,grants:['ev_old_controller']},
      {id:'hotspot_jumper',label:'Сервисная перемычка',x:81.5,y:36.6,w:8.0,h:13.3,requires:{all:['ev_automation_cabinet']},grants:['ev_service_jumper']},
      {id:'hotspot_automation_log',label:'Журнал автоматики',x:35.1,y:63.1,w:8.6,h:7.7,requires:{all:['ev_automation_cabinet']},grants:['ev_automation_log']},
      {id:'hotspot_module_slot',label:'Пустой слот модуля',x:68,y:60,w:16,h:21,requires:{all:['ev_automation_cabinet']},grants:['ev_empty_module_slot']}
    ],
    generator:[
      {id:'hotspot_reserve_tank',label:'Резервный топливный бак',x:4,y:24,w:29,h:62,grants:['ev_low_reserve_tank']},
      {id:'hotspot_generator_log',label:'Панель и журнал генератора',x:74,y:22,w:21,h:59,grants:['ev_generator_log']}
    ],
    fuelStorage:[
      {id:'hotspot_fuel_barrels',label:'Топливные бочки',x:2,y:38,w:28,h:51,grants:['ev_fuel_barrels']},
      {id:'hotspot_fuel_ledger',label:'Складской журнал',x:76,y:37,w:19,h:37,grants:['ev_fuel_ledger']},
      {id:'hotspot_fuel_dispense',label:'Оборудование выдачи топлива',x:38,y:42,w:29,h:43,grants:['ev_fuel_dispense_trace']}
    ],
    communications:[
      {id:'hotspot_stepan_radio',label:'Стационарная радиостанция',x:52,y:42,w:19,h:29,grants:['ev_stepan_radio']},
      {id:'hotspot_irina_session',label:'Терминал связи',x:68,y:47,w:17,h:25,grants:['ev_irina_session']},
      {id:'hotspot_maxim_sat',label:'Спутниковый терминал',x:83,y:37,w:14,h:31,grants:['ev_maxim_sat_session']}
    ],
    weather:[
      {id:'hotspot_weather_log',label:'Журнал Метеостанции',x:8,y:62,w:24,h:28,grants:['ev_weather_log']},
      {id:'hotspot_anna_materials',label:'Материалы Анны',x:68,y:57,w:27,h:31,grants:['ev_anna_materials']}
    ],
    maximRoom:[
      {id:'hotspot_modernization_docs',label:'Документы проекта модернизации',x:73,y:49,w:23,h:36,grants:['ev_modernization_docs']}
    ],
    pier:[
      {id:'hotspot_pier_camera',label:'Камера причала',x:75,y:14,w:20,h:32,grants:['ev_pier_camera']}
    ],
    archive:[
      {id:'hotspot_technical_records',label:'Техническая документация контроллера',x:8,y:52,w:42,h:37,requires:{all:['ev_old_controller']},grants:['ev_old_inspection_act','ev_old_error_archive']},
      {id:'hotspot_archive_access',label:'Журнал доступа в архив',x:78,y:35,w:17,h:42,grants:['ev_archive_access_log']},
      {id:'hotspot_old_wreck',label:'Документы старой катастрофы',x:47,y:18,w:21,h:52,grants:['ev_old_wreck_docs']}
    ],
    sofiaRoom:[
      {id:'hotspot_sofia_photos',label:'Фотографии Софьи',x:71,y:50,w:24,h:34,grants:['ev_sofia_photos']},
      {id:'hotspot_sofia_notes',label:'Личные записи Софьи',x:45,y:56,w:19,h:29,grants:['ev_sofia_notes']}
    ],
    kirillRoom:[
      {id:'hotspot_kirill_docs',label:'Рабочие документы Кирилла',x:3,y:52,w:34,h:36,grants:['ev_kirill_work_docs']},
      {id:'hotspot_kirill_case',label:'Кейс Кирилла',x:53,y:54,w:27,h:35,grants:['ev_kirill_module']}
    ]
  };


  const collectibleDefs = {
    central1:[]
  };

  const defaults = {
    schemaVersion:3,
    started:false,
    prologueSeen:false,
    currentPlace:'central1',
    mapUnlocked:false,
    introComplete:false,
    evidence:[],
    statements:[],
    conclusions:[],
    stages:[],
    talks:{stepan:{},kirill:{},maxim:{},irina:{},anna:{},oleg:{},sofia:{}},
    activeTopic:{},
    notes:[],
    matrixResults:{},
    matrixActiveCell:'stepan:motive',
    final:{step:0,solved:false,answers:[]},
    caseSolved:false
  };

  function cloneDefaults(){ return JSON.parse(JSON.stringify(defaults)); }

  function normalizeState(raw){
    const base=cloneDefaults();
    const merged={...base,...(raw||{})};
    merged.schemaVersion=3;
    merged.evidence=uniq(Array.isArray(raw?.evidence)?raw.evidence:[]);
    merged.statements=uniq(Array.isArray(raw?.statements)?raw.statements:[]);
    merged.conclusions=uniq(Array.isArray(raw?.conclusions)?raw.conclusions:[]);
    merged.stages=uniq(Array.isArray(raw?.stages)?raw.stages:[]);
    merged.notes=uniq(Array.isArray(raw?.notes)?raw.notes:[]);
    merged.talks={stepan:{},kirill:{},maxim:{},irina:{},anna:{},oleg:{},sofia:{},...(raw?.talks||{})};
    merged.activeTopic={...(raw?.activeTopic||{})};
    merged.matrixResults=(raw?.matrixResults&&typeof raw.matrixResults==='object')?raw.matrixResults:{};
    merged.matrixActiveCell=typeof raw?.matrixActiveCell==='string'?raw.matrixActiveCell:'stepan:motive';
    merged.final=(raw?.final&&typeof raw.final==='object')?{...base.final,...raw.final}:base.final;
    return merged;
  }

  function load(){
    try{
      const current=localStorage.getItem(SAVE_KEY);
      if(current) return normalizeState(JSON.parse(current));
      const legacy=localStorage.getItem(LEGACY_SAVE_KEY);
      if(legacy) return normalizeState(JSON.parse(legacy));
    }catch{}
    return cloneDefaults();
  }

  let state=load();
  let currentSuspect=null;

  function save(){ localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }

  function toast(text){
    const el=$('#toast'); if(!el)return;
    el.textContent=text; el.classList.add('show');
    clearTimeout(toast._t); toast._t=setTimeout(()=>el.classList.remove('show'),2600);
  }

  function showScreen(sel){ $$('.screen').forEach(s=>s.classList.remove('active')); $(sel)?.classList.add('active'); }
  function openPrologue(){ $('#mayakPrologueOverlay')?.classList.remove('hidden'); document.body.classList.add('modal-open'); }
  function closePrologue(){ $('#mayakPrologueOverlay')?.classList.add('hidden'); document.body.classList.remove('modal-open'); }
  function syncMenu(){ const btn=$('[data-mayak-action="start"]'); if(btn)btn.textContent=state.started?'Продолжить расследование':'Начать расследование'; }

  function has(token){
    if(!token) return false;
    if(token==='intro_complete') return !!state.introComplete;
    if(token.startsWith('ev_')) return state.evidence.includes(token);
    if(token.startsWith('st_')) return state.statements.includes(token);
    if(token.startsWith('cl_')) return state.conclusions.includes(token);
    if(token.startsWith('stage_')) return state.stages.includes(token);
    if(token.startsWith('topic:')){
      const [,sid,tid]=token.split(':');
      return !!state.talks?.[sid]?.[tid];
    }
    return false;
  }

  function matches(req){
    if(!req) return true;
    if(typeof req==='string') return has(req);
    if(Array.isArray(req)) return req.every(has);
    const all=(req.all||[]).every(has);
    const any=!req.any?.length || req.any.some(has);
    const not=(req.not||[]).every(x=>!has(x));
    return all&&any&&not;
  }

  function grantStatement(id){ if(id && !state.statements.includes(id)) state.statements.push(id); }
  function grantEvidence(id){
    if(!evidenceDefs[id] || state.evidence.includes(id)) return false;
    state.evidence.push(id); return true;
  }

  function requiredIntroDone(){ return introRequirements.every(([sid,tid])=>!!state.talks?.[sid]?.[tid]); }

  function completeIntroIfReady(){
    if(state.introComplete || !requiredIntroDone()) return false;
    state.introComplete=true; state.mapUnlocked=true; state.currentPlace='central1';
    state.notes.push('22:17 — погас основной огонь маяка; резервная система не запустилась.');
    state.notes.push('Первичная версия Кирилла: шторм и старое оборудование. Её нужно проверить по техническим данным.');
    state.notes.push('Максим сообщил о разговоре через стационарный спутниковый терминал до отключения маяка.');
    if(!state.stages.includes('stage_map_open')) state.stages.push('stage_map_open');
    save();
    toast('Первичные опросы завершены. Карта острова открыта.');
    return true;
  }

  function recomputeDerived({silent=false}={}){
    completeIntroIfReady();
    const gained=[];
    let changed=true;
    while(changed){
      changed=false;
      Object.entries(conclusionDefs).forEach(([id,def])=>{
        if(!state.conclusions.includes(id) && matches(def.requires)){
          state.conclusions.push(id); gained.push(id); changed=true;
        }
      });
      Object.entries(stageDefs).forEach(([id,def])=>{
        if(!state.stages.includes(id) && matches(def.requires)){
          state.stages.push(id); changed=true;
        }
      });
    }
    if(state.stages.includes('stage_map_open')) state.mapUnlocked=true;
    save();
    if(!silent && gained.length){
      const last=conclusionDefs[gained[gained.length-1]];
      if(last) toast(`Новый вывод: ${last.title}`);
    }
    return gained;
  }

  function start(){
    state.started=true; save(); syncMenu();
    if(!state.prologueSeen){openPrologue();return;}
    openPlace(state.currentPlace||'central1');
  }

  function begin(){
    state.started=true; state.prologueSeen=true; state.currentPlace='central1'; save();
    closePrologue(); openPlace('central1');
  }

  function locationUnlocked(id){
    if(id==='central1') return true;
    if(!state.mapUnlocked) return false;
    const rule=placeUnlockRules[id];
    return !rule || matches(rule);
  }

  function lockedPlaceReason(id){
    if(id==='maximRoom') return 'Откроется после разговора с Максимом о выгоде проекта.';
    if(id==='sofiaRoom') return 'Сначала докажите, что Софья скрыла посещение архива.';
    if(id==='kirillRoom') return 'Нужно установить мотив Кирилла и спросить его о пропавшем модуле.';
    return 'Локация пока недоступна.';
  }

  function renderMap(){
    if(!state.mapUnlocked){ toast('Сначала поговорите со Степаном, Кириллом и Максимом.'); openPlace('central1'); return; }
    closeChooser(); showScreen('#mayakMapScreen');
    const host=$('#mayakMapHotspots'); if(!host)return;
    host.innerHTML=Object.entries(groups).map(([id,g])=>{
      const h=g.hotspot;
      return `<button class="mayak-map-hotspot" data-mayak-group="${id}" aria-label="${g.title}" style="left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%"><span class="mayak-map-label">${g.title}</span></button>`;
    }).join('');
  }

  function openChooser(groupId){
    if(!state.mapUnlocked){toast('Карта пока закрыта.');return;}
    const g=groups[groupId]; if(!g)return;
    const modal=$('#mayakPlaceChooser');
    $('#mayakPlaceTitle').textContent=g.title;
    $('#mayakPlaceList').innerHTML=g.places.map(id=>{
      const p=places[id]; const unlocked=locationUnlocked(id);
      const desc=unlocked?p.desc:lockedPlaceReason(id);
      return `<button class="mayak-place-btn ${unlocked?'':'locked'}" data-mayak-place="${id}" ${unlocked?'':'disabled'}><strong>${p.title}</strong><small>${desc}</small></button>`;
    }).join('');
    modal.classList.remove('hidden'); document.body.classList.add('modal-open');
  }

  function closeChooser(){
    $('#mayakPlaceChooser')?.classList.add('hidden');
    if($('#mayakPrologueOverlay')?.classList.contains('hidden'))document.body.classList.remove('modal-open');
  }

  function centralSceneImage(){
    // Центральный зал — одна постоянная локация.
    // Этап расследования меняет доступные действия и персонажей, но не фон комнаты.
    return places.central1.img;
  }

  function currentSceneImage(){
    if(state.currentPlace==='central1') return places.central1.img;
    return places[state.currentPlace]?.img||places.central1.img;
  }

  function evidenceHotspotDone(h){ return (h.grants||[]).every(id=>state.evidence.includes(id)); }


  function renderCollectibles(){
    if(!window.DetectiveCollectibles) return;
    window.DetectiveCollectibles.render({
      host:'#mayakSceneObjects',
      items:collectibleDefs[state.currentPlace]||[],
      isAvailable:item=>matches(item.requires),
      isCollected:item=>{
        const ids=(item.grants||[item.evidence]).filter(Boolean);
        return ids.length>0 && ids.every(id=>state.evidence.includes(id));
      },
      onCollect:item=>{
        if(!matches(item.requires)) return;
        const found=[];
        (item.grants||[item.evidence]).filter(Boolean).forEach(ev=>{
          if(grantEvidence(ev)) found.push(ev);
        });
        if(!found.length) return;
        recomputeDerived();
        const names=found.map(ev=>evidenceDefs[ev]?.title).filter(Boolean);
        toast(names.length===1?`Найдена улика: ${names[0]}`:`Найдены материалы: ${names.join(', ')}`);
        renderCollectibles();
        renderSceneHotspots();
      }
    });
  }

  function renderSceneHotspots(){
    const host=$('#mayakHotspots'); if(!host)return;
    const people=[];
    if(!state.caseSolved){
      const def=personHotspots[state.currentPlace];
      if(def){
        const arr=state.introComplete?(def.after||[]):(def.before||[]);
        arr.forEach(h=>people.push(`<button class="hotspot character-hotspot mayak-person-hotspot" data-mayak-suspect="${h.sid}" aria-label="${suspects[h.sid].name}" style="left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%"><span class="hotspot-label">${suspects[h.sid].name}</span></button>`));
      }
    }
    const evidence=(sceneHotspots[state.currentPlace]||[])
      .filter(h=>matches(h.requires) && (!evidenceHotspotDone(h) || h.persistent))
      .map(h=>{
        const classes=['hotspot','evidence-hotspot','mayak-evidence-hotspot'];
        if(h.stealth) classes.push('stealth-evidence-hotspot');
        return `<button class="${classes.join(' ')}" data-mayak-hotspot="${h.id}" aria-label="${h.label}" style="left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%"><span class="hotspot-label">${h.label}</span></button>`;
      });
    host.innerHTML=[...people,...evidence].join('');
  }

  function findHotspot(id){ return (sceneHotspots[state.currentPlace]||[]).find(h=>h.id===id); }

  function inspectHotspot(id){
    const h=findHotspot(id); if(!h || !matches(h.requires)) return;
    const found=[];
    (h.grants||[]).forEach(ev=>{ if(grantEvidence(ev)) found.push(ev); });
    if(found.length){
      recomputeDerived();
      const names=found.map(ev=>evidenceDefs[ev]?.title).filter(Boolean);
      toast(names.length===1?`Найдена улика: ${names[0]}`:`Найдены материалы: ${names.join(', ')}`);
      renderCollectibles();
      renderSceneHotspots();
    }else toast('Этот объект уже осмотрен.');
  }

  function openPlace(id){
    if(!places[id])return;
    if(!state.mapUnlocked && id!=='central1'){toast('Эта локация откроется после стартовых разговоров.');id='central1';}
    if(!locationUnlocked(id)){toast(lockedPlaceReason(id));return;}
    state.currentPlace=id; save(); closeChooser();
    $('#mayakLocationTitle').textContent=places[id].title;
    const scene=$('#mayakScene'); const bg=$('#mayakSceneBg');
    if(scene)scene.dataset.location=id;
    if(bg){ bg.style.backgroundImage=`url("${id==='central1'?centralSceneImage():places[id].img}")`; bg.setAttribute('aria-label',places[id].title); }
    renderCollectibles();
    renderSceneHotspots(); showScreen('#mayakSceneScreen');
  }

  function visibleTopics(sid){
    const s=suspects[sid]; if(!s)return[];
    return s.topics.filter(t=>matches(t.requires));
  }

  function statementMeta(id){
    for(const [sid,s] of Object.entries(suspects)){
      for(const topic of s.topics){
        if((topic.grants||[]).includes(id)) return {sid,topic,title:`${s.name}: ${topic.label}`,text:topic.text};
      }
    }
    return null;
  }

  function relatedEvidenceFor(sid){
    return state.evidence.filter(id=>(evidenceDefs[id]?.related||[]).includes(sid));
  }

  function renderInterrogationMeta(sid){
    const s=suspects[sid]; const visible=visibleTopics(sid); const discussed=Object.keys(state.talks?.[sid]||{}).filter(tid=>visible.some(t=>t.id===tid)).length;
    const alibiId=`cl_${sid}_alibi`;
    let status=s.status;
    if(state.conclusions.includes(alibiId)) status='Алиби доказано';
    if(sid==='kirill' && state.conclusions.includes('cl_kirill_no_alibi')) status='Алиби не подтверждено';
    $('#dossierStatus').textContent=status;
    $('#dossierTalkCount').textContent=`Обсуждено: ${discussed}`;
    $('#dossierProgressBar').style.width=`${visible.length?Math.min(100,(discussed/visible.length)*100):0}%`;
    const linked=relatedEvidenceFor(sid);
    $('#dossierEvidenceCount').textContent=`${linked.length} найдено`;
    $('#dossierEvidence').innerHTML=linked.length?linked.slice(-6).map(id=>`<span class="dossier-evidence-chip"><b>◇</b>${evidenceDefs[id].title}</span>`).join(''):'<span class="dossier-evidence-empty">Связанные материалы пока не найдены</span>';
  }

  function renderMayakTopics(sid){
    const s=suspects[sid]; const box=$('#topicList'); if(!box)return;
    box.innerHTML='';
    visibleTopics(sid).forEach(t=>{
      const b=document.createElement('button'); b.type='button'; b.dataset.mayakTopic=t.id;
      const discussed=!!state.talks?.[sid]?.[t.id];
      const badge=t.required&&!discussed?'<small class="topic-new-badge">Важно</small>':discussed?'<small class="topic-done-badge">Обсуждено</small>':(t.type==='present'?'<small class="topic-new-badge">Материал</small>':'');
      b.innerHTML=`<span>${t.label}</span>${badge}`;
      if(discussed)b.classList.add('discussed-topic');
      if(state.activeTopic?.[sid]===t.id)b.classList.add('active-topic');
      b.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();askMayakTopic(sid,t);});
      box.appendChild(b);
    });
  }

  function askMayakTopic(sid,t){
    if(!matches(t.requires))return;
    state.talks[sid] ||= {};
    state.talks[sid][t.id]={text:t.text,at:Date.now()};
    state.activeTopic[sid]=t.id;
    (t.grants||[]).forEach(grantStatement);
    $('#dialogueText').textContent=t.text;
    const justCompleted=completeIntroIfReady();
    recomputeDerived();
    renderMayakTopics(sid); renderInterrogationMeta(sid); renderPanelsIfOpen();
    if(justCompleted) $('#dialogueText').insertAdjacentHTML('afterbegin','<span class="dialogue-kicker final">КАРТА ОСТРОВА ОТКРЫТА</span>');
  }

  function openMayakInterrogation(sid){
    const s=suspects[sid]; if(!s)return;
    if(!state.mapUnlocked && !['stepan','kirill','maxim'].includes(sid)){toast('Сначала завершите стартовые разговоры.');return;}
    currentSuspect=sid;
    const interrogation=$('#interrogation');
    interrogation.dataset.case='mayak'; interrogation.dataset.suspect=sid;
    $('#suspectSprite').src=s.portrait; $('#suspectSprite').alt=s.name;
    const parts=s.name.split(/\s+/); $('#suspectFirstName').textContent=parts.shift()||''; $('#suspectLastName').textContent=parts.join(' ');
    $('#suspectRole').textContent=s.role; $('#suspectMood').textContent=s.mood;
    const bg=$('#interrogationBg'); if(bg)bg.style.backgroundImage=`url('${currentSceneImage()}')`;
    const active=state.activeTopic?.[sid]; const topic=visibleTopics(sid).find(t=>t.id===active);
    $('#dialogueText').textContent=topic?.text||'Выберите тему разговора.';
    renderMayakTopics(sid); renderInterrogationMeta(sid);
    interrogation.classList.remove('hidden');
  }

  function closeInterrogation(){
    const i=$('#interrogation'); if(i){i.classList.add('hidden');i.dataset.case='';}
    currentSuspect=null; openPlace(state.currentPlace||'central1');
  }

  function allFacts(){
    const facts=[];
    state.evidence.forEach(id=>{
      const e=evidenceDefs[id]; if(!e)return;
      facts.push({key:`e:${id}`,kind:'Улика',icon:e.icon,iconHtml:evidenceVisual(id,e.icon),title:e.title,text:e.desc,rawText:e.desc});
    });
    state.statements.forEach(id=>{
      const m=statementMeta(id); if(!m)return;
      facts.push({key:`t:${id}`,kind:'Показание',icon:'“',title:m.title,text:m.text,rawText:m.text});
    });
    state.conclusions.forEach(id=>{
      const c=conclusionDefs[id]; if(!c)return;
      facts.push({key:`d:${id}`,kind:'Вывод',icon:'✓',title:c.title,text:'',rawText:c.desc});
    });
    return facts;
  }

  function showPeople(){
    const available=state.mapUnlocked?['stepan','kirill','maxim','irina','anna','oleg','sofia']:['stepan','kirill','maxim'];
    const items=available.map(id=>{
      const s=suspects[id]; const count=Object.keys(state.talks[id]||{}).length;
      let statusText=count?`Обсуждено тем: ${count}`:s.status;
      let statusClass=count?'warn status-progress':'status-base';
      if(state.conclusions.includes(`cl_${id}_alibi`)){statusText='Алиби доказано';statusClass='hot status-progress';}
      if(id==='kirill'&&state.conclusions.includes('cl_kirill_no_alibi')){statusText='Нет подтверждённого алиби';statusClass='warn status-progress';}
      return {id,img:s.portrait,name:s.name,role:s.role,statusClass,statusText};
    });
    window.DetectivePanels.people({kicker:'ПОДОЗРЕВАЕМЫЕ',title:'Люди',items});
    $$('[data-universal-suspect]').forEach(card=>card.addEventListener('click',()=>{
      const sid=card.dataset.universalSuspect;
      $('#modal')?.classList.add('hidden');
      openMayakInterrogation(sid);
    }));
  }

  function showMaterials(){
    const unknownCount=Math.max(0,Object.keys(evidenceDefs).length-state.evidence.length);
    window.DetectivePanels.materials({kicker:'МАТЕРИАЛЫ ДЕЛА',title:'Материалы дела',facts:allFacts(),unknownCount});
  }

  function timelineRows(){
    const rows=[['22:17','Гаснет основной огонь маяка. Резервная система не запускается.']];
    if(state.evidence.includes('ev_generator_log')) rows.push(['22:18','Автоматика даёт команду на запуск резерва, но генератор останавливается из-за падения давления топлива.']);
    if(state.conclusions.includes('cl_sabotage_time')) rows.unshift(['21:45:54–21:48:19','Локальное сервисное вмешательство в автоматику: изменён порог защиты и отключён автоматический перезапуск.']);
    if(state.evidence.includes('ev_pier_camera')) rows.unshift(['21:43–21:52','Камера фиксирует Олега на причале.']);
    if(state.evidence.includes('ev_sofia_photos')) rows.unshift(['21:41–21:52','Софья находится в закрытом архиве; фотографии сделаны в 21:45, 21:47 и 21:49.']);
    if(state.evidence.includes('ev_kirill_module')) rows.push(['После аварии','Пропавший диагностический модуль найден в кейсе Кирилла.']);
    return rows;
  }

  function mayakNotebookBody(tab){
    if(tab==='timeline'){
      return `<div class="timeline">${timelineRows().map(r=>`<div class="timeline-row"><time>${r[0]}</time><div>${r[1]}</div></div>`).join('')}</div>`;
    }
    if(tab==='statements'){
      const entries=state.statements.map(id=>{
        const m=statementMeta(id); return m?`<div class="note quote"><b>${suspects[m.sid].name}:</b><br>${m.text}</div>`:'';
      }).filter(Boolean);
      return `<div class="note-list">${entries.length?entries.join(''):'<div class="card"><p>Пока нет зафиксированных показаний.</p></div>'}</div>`;
    }
    const tasks=notebookTasks.filter(t=>matches(t.appears)).map(t=>{
      const done=matches(t.done);
      return `<div class="note observation-task ${done?'done':''}"><span class="observation-task-mark">${done?'✓':'○'}</span><span>${t.text}</span></div>`;
    }).join('');
    const conclusions=state.conclusions.map(id=>`<div class="note"><b>Вывод:</b> ${conclusionDefs[id]?.title||id}</div>`).join('');
    const notes=(state.notes||[]).map(n=>`<div class="note">${n}</div>`).join('');
    return `<div class="note-list">${tasks}${conclusions}${notes}</div>`;
  }

  function renderMayakNotebookTab(tab='timeline'){
    $('#modalBody').innerHTML=window.DetectivePanels.notebookHtml(tab,mayakNotebookBody(tab));
    $$('[data-tab]').forEach(b=>b.addEventListener('click',()=>renderMayakNotebookTab(b.dataset.tab)));
  }

  function showNotebook(){
    window.DetectivePanels.notebook({kicker:'РАБОЧИЕ ЗАПИСИ',title:'Блокнот',active:'timeline',body:''});
    renderMayakNotebookTab('timeline');
  }

  const mayakMatrixColumns=window.DetectivePanels.suspectMatrixColumns();

  const matrixCellDefs = {
    'stepan:motive':{question:'Был ли у Степана мотив скрывать обстоятельства аварии?',relevant:['d:cl_stepan_hidden_violation'],routes:[{requires:['d:cl_stepan_hidden_violation'],status:'partial',label:'Есть зацепка',result:'Скрывал служебное нарушение',explanation:'Степан действительно скрывал нарушение, но это не доказывает мотив саботировать маяк.'}]},
    'stepan:access':{question:'Имел ли Степан доступ к автоматике?',relevant:['t:st_stepan_access'],routes:[{requires:['t:st_stepan_access'],status:'yes',label:'Доказано',result:'Доступ был',explanation:'Степан как смотритель имел постоянный технический доступ.'}]},
    'stepan:opportunity':{question:'Мог ли Степан вмешаться в автоматику в 21:46–21:48?',relevant:['d:cl_stepan_alibi'],routes:[{requires:['d:cl_stepan_alibi'],status:'no',label:'Исключена',result:'Возможность исключена',explanation:'Независимая радиозапись помещает Степана у стационарного передатчика.'}]},
    'stepan:alibi':{question:'Есть ли независимое подтверждение алиби Степана?',relevant:['d:cl_stepan_alibi'],routes:[{requires:['d:cl_stepan_alibi'],status:'yes',label:'Доказано',result:'Алиби доказано',explanation:'Радиозапись независимо подтверждает его местонахождение.'}]},

    'irina:motive':{question:'Был ли у Ирины мотив вмешаться в работу маяка?',relevant:['t:st_irina_conflict','d:cl_irina_secret_report'],routes:[{requires:['t:st_irina_conflict','d:cl_irina_secret_report'],status:'partial',label:'Есть зацепка',result:'Конфликт был, мотив саботажа не доказан',explanation:'Ирина хотела официальной проверки и модернизации, но это не доказывает намерение устроить аварию.'}]},
    'irina:access':{question:'Имела ли Ирина технический доступ?',relevant:['t:st_irina_access'],routes:[{requires:['t:st_irina_access'],status:'partial',label:'Ограничен',result:'Доступ ограниченный',explanation:'Ирина могла войти в техническую зону, но не обслуживала силовой контроллер самостоятельно.'}]},
    'irina:opportunity':{question:'Могла ли Ирина действовать в критический интервал?',relevant:['d:cl_irina_alibi'],routes:[{requires:['d:cl_irina_alibi'],status:'no',label:'Исключена',result:'Возможность исключена',explanation:'Стационарный терминал фиксирует Ирину в Комнате связи.'}]},
    'irina:alibi':{question:'Есть ли независимое подтверждение алиби Ирины?',relevant:['d:cl_irina_alibi'],routes:[{requires:['d:cl_irina_alibi'],status:'yes',label:'Доказано',result:'Алиби доказано',explanation:'Сеанс стационарного терминала охватывает весь критический интервал.'}]},

    'anna:motive':{question:'Почему Анна скрывала интерес к старой катастрофе?',relevant:['d:cl_anna_personal_connection'],routes:[{requires:['d:cl_anna_personal_connection'],status:'partial',label:'Есть зацепка',result:'Личный интерес к прошлому',explanation:'Анна скрывала семейную связь со старой катастрофой, но к нынешнему саботажу это не привязывает.'}]},
    'anna:access':{question:'Имела ли Анна доступ к автоматике?',relevant:['t:st_stepan_access'],routes:[{requires:['t:st_stepan_access'],status:'no',label:'Нет',result:'Технический доступ не подтверждён',explanation:'Степан перечисляет людей с техническим доступом; Анны среди них нет.'}]},
    'anna:opportunity':{question:'Могла ли Анна вмешаться в автоматику в нужное время?',relevant:['d:cl_anna_alibi'],routes:[{requires:['d:cl_anna_alibi'],status:'no',label:'Исключена',result:'Возможность исключена',explanation:'Ручные операции Метеостанции идут через критический интервал.'}]},
    'anna:alibi':{question:'Есть ли независимое подтверждение алиби Анны?',relevant:['d:cl_anna_alibi'],routes:[{requires:['d:cl_anna_alibi'],status:'yes',label:'Доказано',result:'Алиби доказано',explanation:'Журнал Метеостанции подтверждает её местонахождение.'}]},

    'maxim:motive':{question:'Была ли авария финансово выгодна Максиму?',relevant:['d:cl_maxim_financial_interest'],routes:[{requires:['d:cl_maxim_financial_interest'],status:'yes',label:'Есть',result:'Финансовый интерес подтверждён',explanation:'Документы и слова Максима подтверждают реальную заинтересованность в модернизации.'}]},
    'maxim:access':{question:'Имел ли Максим доступ к автоматике?',relevant:['t:st_stepan_access'],routes:[{requires:['t:st_stepan_access'],status:'no',label:'Нет',result:'Доступ не подтверждён',explanation:'В перечне людей с техническим доступом Максима нет.'}]},
    'maxim:opportunity':{question:'Мог ли Максим вмешаться в систему в 21:46–21:48?',relevant:['d:cl_maxim_alibi'],routes:[{requires:['d:cl_maxim_alibi'],status:'no',label:'Исключена',result:'Возможность исключена',explanation:'Стационарный спутниковый терминал фиксирует его в Комнате связи.'}]},
    'maxim:alibi':{question:'Есть ли независимое подтверждение алиби Максима?',relevant:['d:cl_maxim_alibi'],routes:[{requires:['d:cl_maxim_alibi'],status:'yes',label:'Доказано',result:'Алиби доказано',explanation:'Журнал стационарного терминала независимо подтверждает разговор.'}]},

    'oleg:motive':{question:'Что скрывал Олег?',relevant:['d:cl_oleg_fuel_theft'],routes:[{requires:['d:cl_oleg_fuel_theft'],status:'yes',label:'Доказано',result:'Скрывал хищение топлива',explanation:'Олег действительно совершал отдельное преступление и был заинтересован скрыть его.'}]},
    'oleg:access':{question:'К чему имел доступ Олег?',relevant:['t:st_oleg_fuel_responsibility'],routes:[{requires:['t:st_oleg_fuel_responsibility'],status:'partial',label:'К топливу',result:'Доступ к топливной ветке есть',explanation:'Олег отвечал за доставку и имел прямой контакт с топливом, но технический доступ к автоматике не подтверждён.'}]},
    'oleg:opportunity':{question:'Мог ли Олег саботировать основной маяк?',relevant:['d:cl_oleg_alibi'],routes:[{requires:['d:cl_oleg_alibi'],status:'no',label:'Исключена',result:'Саботаж исключён',explanation:'Камера непрерывно фиксирует Олега на причале.'}]},
    'oleg:alibi':{question:'Есть ли независимое подтверждение алиби Олега?',relevant:['d:cl_oleg_alibi'],routes:[{requires:['d:cl_oleg_alibi'],status:'yes',label:'Доказано',result:'Алиби на саботаж доказано',explanation:'Запись камеры охватывает весь критический интервал.'}]},

    'sofia:motive':{question:'Почему Софья скрывала свои действия?',relevant:['d:cl_sofia_family_connection'],routes:[{requires:['d:cl_sofia_family_connection'],status:'partial',label:'Есть зацепка',result:'Личный интерес к архиву',explanation:'Софья пыталась восстановить историю своего деда. Это объясняет ложь об архиве, но не даёт мотива отключать маяк.'}]},
    'sofia:access':{question:'К чему получила доступ Софья?',relevant:['d:cl_sofia_archive_lie'],routes:[{requires:['d:cl_sofia_archive_lie'],status:'partial',label:'К архиву',result:'Незаконный доступ к архиву доказан',explanation:'Софья проникла в архив, но технический доступ к автоматике не подтверждён.'}]},
    'sofia:opportunity':{question:'Могла ли Софья вмешаться в автоматику в 21:46–21:48?',relevant:['d:cl_sofia_alibi'],routes:[{requires:['d:cl_sofia_alibi'],status:'no',label:'Исключена',result:'Возможность исключена',explanation:'Журнал двери и фотографии удерживают Софью внутри архива.'}]},
    'sofia:alibi':{question:'Есть ли независимое подтверждение алиби Софьи?',relevant:['d:cl_sofia_alibi'],routes:[{requires:['d:cl_sofia_alibi'],status:'yes',label:'Доказано',result:'Алиби доказано',explanation:'Два независимых типа данных подтверждают её пребывание в архиве.'}]},

    'kirill:motive':{question:'Был ли у Кирилла мотив вывести старый контроллер из строя?',relevant:['d:cl_kirill_motive'],routes:[{requires:['d:cl_kirill_motive'],status:'yes',label:'Доказан',result:'Мотив установлен',explanation:'Предстоящая проверка могла раскрыть прошлогоднее сокрытие неисправностей.'}]},
    'kirill:access':{question:'Имел ли Кирилл технический доступ?',relevant:['d:cl_kirill_access'],routes:[{requires:['d:cl_kirill_access'],status:'yes',label:'Доказан',result:'Технический доступ доказан',explanation:'Показание Степана и рабочие документы подтверждают полномочия Кирилла.'}]},
    'kirill:opportunity':{question:'Можно ли исключить Кирилла по времени?',relevant:['d:cl_kirill_access','d:cl_kirill_no_alibi'],routes:[{requires:['d:cl_kirill_access','d:cl_kirill_no_alibi'],status:'partial',label:'Не исключена',result:'Возможность не исключена',explanation:'Кирилл имел доступ и не имеет подтверждённого алиби. Это ещё не доказывает присутствие у шкафа, но не позволяет исключить его.'}]},
    'kirill:alibi':{question:'Есть ли независимое подтверждение алиби Кирилла?',relevant:['d:cl_kirill_no_alibi'],routes:[{requires:['d:cl_kirill_no_alibi'],status:'no',label:'Нет',result:'Алиби не подтверждено',explanation:'Кирилл не может подтвердить своё местонахождение в критический интервал независимыми материалами.'}]}
  };

  const matrixRequiredAlibis=['stepan:alibi','irina:alibi','anna:alibi','maxim:alibi','oleg:alibi','sofia:alibi','kirill:alibi'];

  function factAvailable(key){
    const [kind,id]=key.split(':');
    if(kind==='e') return state.evidence.includes(id);
    if(kind==='t') return state.statements.includes(id);
    if(kind==='d') return state.conclusions.includes(id);
    return false;
  }

  function factMap(){ return new Map(allFacts().map(f=>[f.key,f])); }
  function sameSet(a,b){ return a.length===b.length && a.every(x=>b.includes(x)); }
  function kindClass(kind){ return kind==='Улика'?'evidence':kind==='Показание'?'testimony':'deduction'; }
  function materialCard(f,selected=false){
    const body=f.kind==='Показание'?`<span>${f.text}</span>`:'';
    return `<button class="case-material kind-${kindClass(f.kind)} ${selected?'selected':''}" data-matrix-fact="${f.key}"><span class="case-material-icon">${f.icon}</span><span><small>${f.kind}</small><b>${f.title}</b>${body}</span><em>${selected?'✓':''}</em></button>`;
  }

  function matrixCellReady(def){ return !!def && (def.routes||[]).some(r=>(r.requires||[]).every(factAvailable)); }
  function availableRelevant(def){ return uniq((def?.relevant||[]).filter(factAvailable)); }
  function matrixAlibisVerified(){ return matrixRequiredAlibis.every(k=>!!state.matrixResults[k]); }
  function matrixAlibiCount(){ return matrixRequiredAlibis.filter(k=>!!state.matrixResults[k]).length; }
  function finalGateReady(){ return state.stages.includes('stage_final_ready') && matrixAlibisVerified(); }

  function matrixHtml(activeKey=state.matrixActiveCell){
    const order=['stepan','kirill','maxim','irina','anna','oleg','sofia'];
    const statusMeta={yes:{symbol:'✓',cls:'yes'},no:{symbol:'×',cls:'no'},partial:{symbol:'~',cls:'partial'}};
    const rows=order.map(sid=>({
      img:suspects[sid].portrait,name:suspects[sid].name,role:suspects[sid].role,
      cellsHtml:mayakMatrixColumns.map(col=>{
        const key=`${sid}:${col.id}`; const def=matrixCellDefs[key]; const result=state.matrixResults[key]; const ready=!result&&matrixCellReady(def); const hasData=!result&&availableRelevant(def).length>0;
        const meta=result?statusMeta[result.status]:null;
        const cls=result?`resolved ${meta?.cls||''}`:ready?'ready':hasData?'available':'unknown';
        const symbol=result?(meta?.symbol||'•'):ready?'!':hasData?'•':'?';
        const label=result?(result.label||'Проверено'):ready?'Можно проверить':hasData?'Есть материалы':'Нет материалов';
        return `<td><button class="suspect-matrix-cell ${cls} ${key===activeKey?'active':''}" data-matrix-cell="${key}"><span>${symbol}</span><b>${label}</b></button></td>`;
      }).join('')
    }));
    const [sid,colId]=activeKey.split(':'); const s=suspects[sid]||suspects.stepan; const col=mayakMatrixColumns.find(c=>c.id===colId)||mayakMatrixColumns[0]; const def=matrixCellDefs[activeKey]; const result=state.matrixResults[activeKey];
    let detail='';
    if(result){
      detail=`<div class="suspect-matrix-result ${statusMeta[result.status]?.cls||''}"><span>${statusMeta[result.status]?.symbol||'✓'}</span><div><small>${col.label}</small><h3>${result.result}</h3><p>${result.explanation}</p><button class="secondary" id="recheckMatrixCell">Перепроверить ячейку</button></div></div>`;
    }else if(def){
      const fmap=factMap(); const relevant=availableRelevant(def); const cards=relevant.map(k=>materialCard(fmap.get(k),false)).join('');
      detail=`<div class="case-tool-heading suspect-matrix-detail-head"><span class="tiny-label">${col.label}</span><h2>${s.name}</h2><p>${def.question}</p></div>
        <div class="suspect-matrix-rule"><b>Как работать с ячейкой</b><span>Выберите только материалы, которые вместе действительно позволяют оценить этот пункт.</span></div>
        <div class="case-materials-head"><div><span class="tiny-label">ДОСТУПНЫЕ МАТЕРИАЛЫ</span><h3>Что относится к этому вопросу?</h3></div><small>до 3 материалов</small></div>
        <div class="case-material-grid suspect-matrix-materials">${cards||'<div class="investigation-empty">Подходящие материалы ещё не найдены.</div>'}</div>
        <div class="investigation-selection-summary">Выбрано материалов: <b id="matrixSelectedCount">0/3</b></div>
        <button id="checkMatrixCell" class="primary investigation-verify" disabled>Проверить ячейку</button><div id="matrixFeedback" class="investigation-feedback"></div>`;
    }
    let finalHtml='';
    if(state.stages.includes('stage_final_ready')){
      if(matrixAlibisVerified()) finalHtml=`<div class="case-final-ready matrix-final-ready"><div><small>ИТОГ РАССЛЕДОВАНИЯ</small><b>Материалы для финальной версии собраны</b><span>Алиби всех семи участников проверены, техническая и топливная ветки разделены, мотив и сокрытие данных Кириллом установлены.</span></div><button class="primary" id="openMayakFinal">Завершить расследование</button></div>`;
      else finalHtml=`<div class="case-final-ready matrix-final-ready matrix-final-locked"><div><small>ФИНАЛ ПОКА ЗАКРЫТ</small><b>Проверьте алиби всех участников</b><span>Проверено: ${matrixAlibiCount()} из ${matrixRequiredAlibis.length}. Одних собранных улик недостаточно — зафиксируйте выводы в Матрице.</span></div></div>`;
    }
    return window.DetectivePanels.suspectMatrixHtml({columns:mayakMatrixColumns,rows,finalHtml,detailHtml:detail,headingTitle:'Кто действительно мог быть причастен?',headingText:'Сравнивайте персонажей по мотиву, доступу, возможности и алиби. Ложь или отдельный проступок сами по себе не доказывают саботаж.'});
  }

  function renderMayakMatrix(activeKey=state.matrixActiveCell){
    state.matrixActiveCell=activeKey; save();
    const body=$('#caseToolBody'); if(!body)return;
    body.innerHTML=matrixHtml(activeKey);
    let selection=[];
    const update=()=>{
      $$('[data-matrix-fact]').forEach(b=>{const selected=selection.includes(b.dataset.matrixFact);b.classList.toggle('selected',selected);const em=b.querySelector('em');if(em)em.textContent=selected?'✓':'';});
      const c=$('#matrixSelectedCount');if(c)c.textContent=`${selection.length}/3`; const check=$('#checkMatrixCell');if(check)check.disabled=selection.length<1;
    };
    $$('[data-matrix-cell]').forEach(btn=>btn.addEventListener('click',()=>renderMayakMatrix(btn.dataset.matrixCell)));
    $$('[data-matrix-fact]').forEach(btn=>btn.addEventListener('click',()=>{
      const k=btn.dataset.matrixFact;
      if(selection.includes(k)) selection=selection.filter(x=>x!==k); else if(selection.length<3) selection.push(k); else $('#matrixFeedback').innerHTML='<div class="investigation-feedback-partial"><b>Не больше трёх материалов.</b><span>Уберите один материал и выберите только относящиеся к этой ячейке.</span></div>';
      update();
    }));
    $('#checkMatrixCell')?.addEventListener('click',()=>{
      const def=matrixCellDefs[activeKey]; const route=(def?.routes||[]).find(r=>sameSet(selection,r.requires||[]));
      if(!route){ $('#matrixFeedback').innerHTML='<div class="investigation-feedback-fail"><b>Эти материалы не позволяют надёжно оценить ячейку.</b><span>Проверьте, отвечают ли они именно на выбранный критерий.</span></div>'; return; }
      state.matrixResults[activeKey]={status:route.status,label:route.label,result:route.result,explanation:route.explanation}; save(); renderMayakMatrix(activeKey);
    });
    $('#recheckMatrixCell')?.addEventListener('click',()=>{delete state.matrixResults[activeKey];save();renderMayakMatrix(activeKey);});
    $('#openMayakFinal')?.addEventListener('click',openFinal);
    window.DetectivePanels.resetMatrixViewport($('#caseToolBody'));
  }

  function showInvestigation(){
    window.DetectivePanels.investigation({title:'Дело «Маяк»',tabTitle:'Матрица подозреваемых',tabSubtitle:'Сравните всех персонажей по фактам',body:''});
    renderMayakMatrix(state.matrixActiveCell||'stepan:motive');
  }

  const finalQuestions = [
    {id:'final_manual_sabotage',question:'Что доказывает, что основной маяк отключился не из-за обычного сбоя?',correct:'manual',choices:[['storm','Шторм был сильным, поэтому старое оборудование могло отключиться само.'],['manual','Сервисная перемычка и журнал автоматики показывают локальное ручное изменение параметров.'],['fuel','Почти пустой резервный бак доказывает отключение основного маяка.']]},
    {id:'final_real_time',question:'Когда произошло настоящее вмешательство в систему?',correct:'2146',choices:[['2217','В 22:17, в момент погасания основного огня.'],['2146','С 21:45:54 до 21:48:19, примерно за полчаса до аварии.'],['2218','В 22:18, когда резерв попытался запуститься.']]},
    {id:'final_oleg_excluded',question:'Почему Олег не мог отключить основной маяк?',correct:'camera',choices:[['innocent','Потому что он признался только в хищении топлива.'],['camera','Он действительно похищал топливо, но камера фиксирует его на причале весь интервал вмешательства.'],['access','Потому что Олег никогда не бывал на острове ночью.']]},
    {id:'final_kirill_motive',question:'Какой мотив был у Кирилла?',correct:'inspection',choices:[['money','Он хотел получить контракт на поставку топлива.'],['inspection','Предстоящая проверка могла раскрыть, что год назад он скрыл уже существовавшие ошибки контроллера.'],['history','Он хотел скрыть сведения о старом кораблекрушении.']]},
    {id:'final_kirill_proof',question:'Что окончательно связывает Кирилла с попыткой скрыть вмешательство?',correct:'module',choices:[['noalibi','Только отсутствие алиби.'],['module','Пропавший диагностический модуль найден в его кейсе после того, как Кирилл солгал о его местонахождении.'],['maxim','Документы Максима о модернизации.']]}
  ];

  function openFinal(){
    if(!finalGateReady()){toast('Финальная версия пока не готова.');return;}
    state.final ||= {step:0,solved:false,answers:[]};
    if(state.final.solved){renderSolvedFinal();return;}
    state.final.step=Math.min(state.final.step||0,finalQuestions.length-1); save(); renderFinalQuestion();
  }

  function renderFinalQuestion(){
    const index=state.final.step||0; const q=finalQuestions[index]; if(!q){solveCase();return;}
    const html=`<div class="case-tool-heading"><span class="tiny-label">ФИНАЛЬНАЯ ПРОВЕРКА · ${index+1}/${finalQuestions.length}</span><h2>${q.question}</h2><p>Выберите вывод, который подтверждается собранными материалами дела.</p></div>
      <div class="case-reconstruction-options mayak-final-options">${q.choices.map(([id,text])=>`<button class="case-reconstruction-option" data-mayak-final-choice="${id}">${text}</button>`).join('')}</div>
      <div id="mayakFinalFeedback" class="investigation-feedback"></div>`;
    window.DetectivePanels.open('ФИНАЛ','Финальная версия',html,{shellClasses:['final-modal-shell'],bodyClasses:['final-modal-body']});
    $$('[data-mayak-final-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.mayakFinalChoice;
      if(id!==q.correct){ $('#mayakFinalFeedback').innerHTML='<div class="investigation-feedback-fail"><b>Этого недостаточно.</b><span>Выберите вариант, который действительно следует из найденных материалов.</span></div>'; return; }
      state.final.answers=uniq([...(state.final.answers||[]),q.id]); state.final.step=index+1; save();
      if(state.final.step>=finalQuestions.length) solveCase(); else renderFinalQuestion();
    }));
  }

  function solveCase(){
    state.caseSolved=true; state.final={...(state.final||{}),solved:true,step:finalQuestions.length};
    if(!state.stages.includes('stage_final')) state.stages.push('stage_final');
    state.currentPlace='central1'; save(); renderSolvedFinal();
  }

  function renderSolvedFinal(){
    const html=`<div class="ending"><h3>Дело раскрыто</h3>
      <p><b>Основной маяк.</b> Кирилл заранее перевёл автоматику в локальный сервисный режим, изменил порог защиты и отключил автоматический перезапуск. Поэтому реальное действие произошло в 21:45:54–21:48:19, а не в момент аварии в 22:17.</p>
      <p><b>Резерв.</b> Олег систематически похищал топливо. Он не отключал основной маяк, но из-за его действий резервный генератор не смог нормально запуститься.</p>
      <p><b>Мотив Кирилла.</b> Прошлогодний акт скрывал уже существовавшие ошибки старого контроллера. Предстоящая проверка могла раскрыть это. Кирилл рассчитывал на контролируемый отказ и последующую замену оборудования.</p>
      <p><b>Попытка скрыть следы.</b> После аварии Кирилл снял диагностический модуль и спрятал его в своём кейсе. Он не знал, что резерв останется без топлива и обычный технический сбой превратится в серьёзную аварию.</p>
      <div class="ending-actions"><button class="primary" data-mayak-final-action="scene">Осмотреть финальную сцену</button><button data-mayak-final-action="menu">Вернуться к историям</button></div></div>`;
    window.DetectivePanels.open('ФИНАЛ','Разоблачение',html,{shellClasses:['final-modal-shell'],bodyClasses:['final-modal-body']});
    $$('[data-mayak-final-action]').forEach(b=>b.addEventListener('click',()=>{
      $('#modal')?.classList.add('hidden');
      if(b.dataset.mayakFinalAction==='menu') backMenu(); else openPlace('central1');
    }));
  }

  function renderPanelsIfOpen(){
    if($('#modal')?.classList.contains('hidden')) return;
    if($('#modalKicker')?.textContent==='РАССЛЕДОВАНИЕ') showInvestigation();
  }
  function showPanel(section){ ({people:showPeople,evidence:showMaterials,notebook:showNotebook,case:showInvestigation}[section]||(()=>{}))(); }

  function backMenu(){ closePrologue(); closeChooser(); $('#interrogation')?.classList.add('hidden'); $('#modal')?.classList.add('hidden'); showScreen('#menuScreen'); syncMenu(); }

  function resetProgress(){
    localStorage.removeItem(SAVE_KEY); localStorage.removeItem(LEGACY_SAVE_KEY); state=cloneDefaults(); currentSuspect=null; syncMenu();
  }

  document.addEventListener('click',e=>{
    const suspect=e.target.closest('[data-mayak-suspect]');
    if(suspect){ e.preventDefault(); e.stopPropagation(); $('#modal')?.classList.add('hidden'); openMayakInterrogation(suspect.dataset.mayakSuspect); return; }
    const hotspot=e.target.closest('[data-mayak-hotspot]'); if(hotspot){e.preventDefault();inspectHotspot(hotspot.dataset.mayakHotspot);return;}
    const group=e.target.closest('[data-mayak-group]'); if(group){openChooser(group.dataset.mayakGroup);return;}
    const place=e.target.closest('[data-mayak-place]'); if(place){openPlace(place.dataset.mayakPlace);return;}
    const a=e.target.closest('[data-mayak-action]'); if(!a)return;
    const act=a.dataset.mayakAction;
    if(act==='start')start();
    else if(act==='begin')begin();
    else if(act==='back-map')renderMap();
    else if(act==='back-menu')backMenu();
    else if(act==='close-chooser')closeChooser();
  });

  recomputeDerived({silent:true});

  window.MayakCase={
    start,renderMap,openPlace,openInterrogation:openMayakInterrogation,closeInterrogation,showPanel,resetProgress,
    definitions:{groups,places,suspects,introRequirements,evidenceDefs,conclusionDefs,stageDefs,sceneHotspots,collectibleDefs,matrixCellDefs,notebookTasks,placeUnlockRules},
    getState:()=>JSON.parse(JSON.stringify(state)),
    debug:{has,matches,recomputeDerived,locationUnlocked,finalGateReady}
  };

  syncMenu();
})();
