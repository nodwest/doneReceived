# Graph Report - doneReceived  (2026-11-20)

## Corpus Check
- 807 files · ~275,029 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .graphify-bak 1, .base 1)

## Summary
- 4482 nodes · 11848 edges · 232 communities (176 shown, 56 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 310 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `67d5e4a0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- maplibre-gl-shared.mjs
- tracking
- zones.ts
- child-card.tsx
- server-tasks-api.ts
- operations-chart.tsx
- ui/family-setup.tsx
- package.json
- withAlpha
- maplibre-gl-worker.mjs
- ds
- useCurrentFamily
- tasks-header.tsx
- child-task-card.tsx
- yt
- subdividePolygonInternal
- use-child-location-sharing.ts
- ui/index.ts
- fw
- ui/map-layers.tsx
- location-sharing-card.tsx
- confirm-step.tsx
- readPackedEnd
- mvp-full-design-variants.canvas.tsx
- http.ts
- writeTag
- parent-invite-code.tsx
- useTheme
- families-api.ts
- auth-layout.tsx
- ui/change-password.tsx
- device-api.ts
- bus-playback.ts
- ur
- use-child-account.ts
- oe
- session/index.ts
- wallet-query.ts
- wishlist.tsx
- map/model/types.ts
- evaluate
- populate
- react
- mvp-apple-premium.canvas.tsx
- devDependencies
- hx
- af
- location-connection.tsx
- task-sheet.tsx
- wallet.ts
- root-layout.tsx
- expo
- operation.ts
- family-events-api.ts
- ui/rewards-history.tsx
- auth-api.ts
- mvp-family-premium-mobile.canvas.tsx
- determineLineBreaks
- ui/tasks.tsx
- map/map.tsx
- activity-card.tsx
- transaction-card.tsx
- family-task-app-wireframes.canvas.tsx
- clone
- layer-preferences.ts
- road-path.ts
- step1-onboarding-design.canvas.tsx
- n
- constructor
- providers/index.tsx
- config.ts
- pe
- validation.ts
- setPaintProperty
- paths
- sortable-list.tsx
- l
- date-time-picker-sheet.tsx
- auth/index.ts
- ui/family-setup.tsx
- avatar-cropper.tsx
- hasDebugData
- balance-card.tsx
- history-map.tsx
- zm
- ui/edit-profile.tsx
- en.ts
- session-storage.web.ts
- i
- family-event.tsx
- Expo Router Navigation
- React Native Best Practices
- Icon
- keep-in-view.ts
- scripts
- rh
- en
- operation/index.ts
- T
- reject-reason-sheet.tsx
- xt
- paint
- lib/index.ts
- ui/calendar.tsx
- wish/index.ts
- Expo Upgrade
- sizes.ts
- splitTile
- use-pair-device.ts
- eh
- family-color-palettes.canvas.tsx
- canvases/mvp-c4-business-logic.canvas.tsx
- oh
- ui/family.tsx
- interpolate
- react-native
- user/index.ts
- en
- obsidian-done/mvp-c4-business-logic.canvas.tsx
- missed-task-tile.tsx
- appendLeaves
- getColorRampTextures
- layout
- addFeature
- bar-3d.tsx
- DoneReceived Project Guidance
- metro.config.js
- Seven-Step Task Definition Form
- kb
- family-color-palettes-new.canvas.tsx
- _refreshViews
- update
- src_shared_api_index_authorizedimage
- earn-goal-card.tsx
- Task Reward Lifecycle
- Gamified Household Task Profile Dashboard
- Child Device Pairing Codes
- Retryable Task Rejection
- wrap
- CLAUDE.md
- createIndex
- ot
- Dp
- getClustersInternal
- ov
- setValue
- react-compiler-destructure-functions.md
- Design System Audit
- Frontend JavaScript Security
- Android Icon Background Template
- Application Favicon
- sortFeatures
- bb
- geometryType
- empty
- prepareSegment
- _unit
- withinInto
- ui/rewards-history.tsx
- Expo Animation Recipes
- Native Platform Menus
- Centered Proportion Guides
- addSymbols
- angleWith
- containsMaxSafeIntegerValues
- crossFadingFactor
- deserializeCollisionBoxes
- dist
- expandBy
- hasOffscreenPass
- interpolationFactor
- l_
- push
- _S
- css.d.ts
- react-state-fallback.md
- rendering-text-in-text-component.md
- scroll-position-no-state.md
- ui-expo-image.md
- ui-image-gallery.md
- ui-measure-views.md
- child-location-task.web.ts
- ref_cursor
- expo-router
- children-carousel.tsx
- get
- featured-event-card.tsx
- activity-card.tsx
- _h
- parse
- period-select.tsx
- session-refresh-lock.ts
- zustand
- star.tsx
- field-hint.tsx
- count-tasks.ts
- copyText
- xr
- checklist-field.styled.ts
- arrow-left.tsx
- badge-check.tsx
- photo-viewer.tsx
- section-header.tsx
- code.tsx
- copy.tsx
- evaluate
- I18n and Accessibility Checklist
- Apache License 2.0
- Modern React Native Styling Patterns
- Blue Upward Chevron App Mark
- Monochrome Upward Chevron App Mark
- Geometric Blue Chevron App Icon
- User Profile Concept
- Child Location and Zones
- Repository Commit Format
- swipeable-row.tsx
- eye.tsx
- refresh.tsx
- chevron-down.tsx
- help.tsx
- person.tsx
- step-dot.tsx
- trash.tsx
- reward-kind-toggle.tsx

## God Nodes (most connected - your core abstractions)
1. `tracking()` - 232 edges
2. `react-native` - 215 edges
3. `react` - 213 edges
4. `theme` - 195 edges
5. `createStyles()` - 135 edges
6. `react-native-svg` - 70 edges
7. `useTheme()` - 68 edges
8. `apiRequest()` - 58 edges
9. `Icon()` - 58 edges
10. `@tanstack/react-query` - 52 edges

## Surprising Connections (you probably didn't know these)
- `styles` --calls--> `tracking()`  [EXTRACTED]
  src/entities/family-event/ui/event-person-chip.tsx → src/shared/theme/typography.ts
- `styles` --calls--> `tracking()`  [EXTRACTED]
  src/entities/task/ui/assignee-avatar.tsx → src/shared/theme/typography.ts
- `styles` --calls--> `tracking()`  [EXTRACTED]
  src/features/cancel-task/ui/cancel-task-sheet.tsx → src/shared/theme/typography.ts
- `styles` --calls--> `tracking()`  [EXTRACTED]
  src/features/reset-invite-code/ui/reset-invite-code-row.tsx → src/shared/theme/typography.ts
- `styles` --calls--> `tracking()`  [EXTRACTED]
  src/features/reset-invite-code/ui/reset-invite-code-sheet.tsx → src/shared/theme/typography.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gamified Task Profile Metrics** — obsidian_done_z_исходники_картинки_pasted_image_20260710153839_progress_summary, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_reward_penalty_ledger, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_achievement_tracking [EXTRACTED 1.00]
- **React Native Animation Rules** — _claude_skills_vercel_react_native_skills_rules_animation_derived_value_use_derived_value, _claude_skills_vercel_react_native_skills_rules_animation_gesture_detector_press_gesture_press, _claude_skills_vercel_react_native_skills_rules_animation_gpu_properties_gpu_animation [EXTRACTED 1.00]
- **Task Completion and Reward Flow** — obsidian_done_c4_task_lifecycle, obsidian_done_сделал_получил_mvp_parent_child_reward_flow, obsidian_done_сделал_получил_идеи_retryable_rejection, obsidian_done_сделал_получил_идеи_wallet_reservation_invariant [INFERRED 0.95]

## Communities (232 total, 56 thin omitted)

### Community 0 - "maplibre-gl-shared.mjs"
Cohesion: 0.01
Nodes (83): Ag, Ar, As, aT, b_, Bn, bp, BS (+75 more)

### Community 1 - "tracking"
Cohesion: 0.05
Nodes (71): styles, styles, styles, styles, styles, styles, styles, RejectionNoteProps (+63 more)

### Community 2 - "zones.ts"
Cohesion: 0.06
Nodes (36): maplibre-gl@6.10.0, @maplibre/maplibre-react-native@^11.4.0, maplibre-gl, @maplibre/maplibre-react-native, MapZone, ZonePoint, OSM_SOURCE, MAP_STYLE (+28 more)

### Community 3 - "child-card.tsx"
Cohesion: 0.11
Nodes (17): ChildOverview, ChildCard(), ChildCardProps, styles, HeaderAvatar(), HeaderAvatarProps, styles, LetterAvatar() (+9 more)

### Community 4 - "server-tasks-api.ts"
Cohesion: 0.06
Nodes (53): AssignmentDto, AttachmentDto, attachmentImage(), checklistBody(), ChildDto, createServerTask(), fetchServerTasks(), LastRejectionDto (+45 more)

### Community 5 - "operations-chart.tsx"
Cohesion: 0.19
Nodes (15): DayTotals, formatMonthShort(), formatWeekdayShort(), facesHeight(), getBarScale(), useDayWheel(), Bar3D(), DayColumn() (+7 more)

### Community 6 - "ui/family-setup.tsx"
Cohesion: 0.10
Nodes (6): ChoiceCard(), ChoiceCardProps, FamilySetupPage(), Mode, SetupField(), SetupFieldProps

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (51): dependencies, @deck.gl/core@^9.4.0, @deck.gl/layers@^9.4.0, @deck.gl/mapbox@^9.4.0, expo-constants@~56.0.27, expo-dev-client@~56.0.27, expo-file-system@~56.0.11, expo-image-manipulator@~56.0.26 (+43 more)

### Community 8 - "withAlpha"
Cohesion: 0.18
Nodes (10): styles, styles, styles, withAlpha(), GRADIENTS, PillButtonProps, PillButtonVariant, styles (+2 more)

### Community 9 - "maplibre-gl-worker.mjs"
Cohesion: 0.05
Nodes (31): ae(), cn, Db(), et(), I, lb(), li, ln() (+23 more)

### Community 10 - "ds"
Cohesion: 0.07
Nodes (53): ao(), as(), bo(), bs(), co(), cs(), Do(), ds() (+45 more)

### Community 11 - "useCurrentFamily"
Cohesion: 0.15
Nodes (20): cancelServerTask(), cancelTask(), Task, useCancelTask(), CancelTaskButton(), CancelTaskSheet(), NO_PHOTOS, NoteDraftState (+12 more)

### Community 12 - "tasks-header.tsx"
Cohesion: 0.18
Nodes (17): darkColors, lightColors, palettes, ThemeColors, ThemeMode, currentMode, getThemeMode(), setThemeModeValue() (+9 more)

### Community 13 - "child-task-card.tsx"
Cohesion: 0.11
Nodes (33): formatAmount(), Operation, CAPTION, OperationRow(), OperationRowProps, ChildTaskCard(), ChildTaskCardProps, PhotoSource() (+25 more)

### Community 14 - "yt"
Cohesion: 0.04
Nodes (49): A_(), av(), bg(), bv(), Cu(), D_(), Dv(), E_() (+41 more)

### Community 15 - "subdividePolygonInternal"
Cohesion: 0.09
Nodes (26): ap(), Bp(), _ensureNoPoleVertices(), _fillPoles(), Fp(), _generateInterEdgeVertices(), _generateIntraEdgeVertices(), _generatePoleQuad() (+18 more)

### Community 16 - "use-child-location-sharing.ts"
Cohesion: 0.08
Nodes (32): expo-location@~56.0.26, expo-location, CHILD_LOCATION_TASK, startChildLocationTask(), stopChildLocationTask(), isLocationSharingEnabled(), locationSharingKey(), setLocationSharingEnabled() (+24 more)

### Community 17 - "ui/index.ts"
Cohesion: 0.04
Nodes (40): react-native-reanimated, DeviceRowProps, RewardButton(), RewardButtonProps, RewardVariant, styles, CancelTaskSheetProps, styles (+32 more)

### Community 18 - "fw"
Cohesion: 0.05
Nodes (43): Aw(), bw(), _C(), Cw(), decodeDictionary(), du(), Dw(), ew() (+35 more)

### Community 19 - "ui/map-layers.tsx"
Cohesion: 0.09
Nodes (21): AddRow(), buildZoneStatuses(), collectRoutes(), Divider(), EmptyRow(), laterTimestamp(), LayerRow(), LayerRowProps (+13 more)

### Community 20 - "location-sharing-card.tsx"
Cohesion: 0.10
Nodes (10): HistoryData, historyDate(), HistoryDay(), HistoryType, MapHistory(), RouteData, styles, timeLabel() (+2 more)

### Community 21 - "confirm-step.tsx"
Cohesion: 0.20
Nodes (15): confirmEmailChange(), requestEmailChange(), resendEmailChange(), fetchMe(), useCooldown(), ChangeEmailErrorInfo, EMAIL_CHANGE_CHECK_MS, useConfirmEmailChange() (+7 more)

### Community 22 - "readPackedEnd"
Cohesion: 0.10
Nodes (25): nextField(), readBoolean(), readBytes(), readDouble(), readFields(), readFixed32(), readFixed64(), readFloat() (+17 more)

### Community 23 - "mvp-full-design-variants.canvas.tsx"
Cohesion: 0.16
Nodes (37): BalanceUpdatedScreen(), BroomIcon(), Btn(), CameraScanArt(), ChildScanScreen(), ChildTasksScreen(), CoinStackArt(), CreateTaskScreen() (+29 more)

### Community 24 - "http.ts"
Cohesion: 0.07
Nodes (45): toPerson(), Message, parse(), RECONNECT_MS, useLocationSocket(), connect(), AFFECTS, DataArea (+37 more)

### Community 25 - "writeTag"
Cohesion: 0.07
Nodes (37): q_(), realloc(), tv(), writeBoolean(), writeBooleanField(), writeBytes(), writeBytesField(), writeDouble() (+29 more)

### Community 26 - "parent-invite-code.tsx"
Cohesion: 0.08
Nodes (32): joinFamilyByCode(), inviteLeft(), useParentInvite(), formatInviteCode(), INVITE_CODE_TEMPLATE, InviteRole, isCompleteInviteCode(), FoundInvite (+24 more)

### Community 27 - "useTheme"
Cohesion: 0.09
Nodes (10): ChildProfilePage(), ServerChildProfile(), CreateTaskPage(), EditTaskPage(), TaskFormScreen(), TaskFormScreenProps, MapZonePage(), styles (+2 more)

### Community 28 - "families-api.ts"
Cohesion: 0.07
Nodes (46): createChild(), createFamily(), createParentInvite(), deleteChild(), FamilyDetailsDto, fetchFamilyChildren(), fetchFamilyDetails(), fetchFamilyMembers() (+38 more)

### Community 29 - "auth-layout.tsx"
Cohesion: 0.06
Nodes (26): AuthFootnoteProps, AuthLayoutProps, styles, Button(), ButtonProps, ButtonState, styles, CardButtonProps (+18 more)

### Community 30 - "ui/change-password.tsx"
Cohesion: 0.05
Nodes (13): ChangePasswordPage(), EMPTY, Field, goBack(), Login(), EMPTY_FORM, Field, Registration() (+5 more)

### Community 31 - "device-api.ts"
Cohesion: 0.12
Nodes (23): DeviceDto, fetchChildDevices(), fetchConnectCode(), PreviewDto, previewPairing(), revokeDevice(), codeLeft(), deviceKeys (+15 more)

### Community 32 - "bus-playback.ts"
Cohesion: 0.11
Nodes (27): Bus, RoadMovement, VehicleSnapshot, bearingAt(), bearingBetween(), bearingOnSegment(), BusPlayback, catchUpRate() (+19 more)

### Community 33 - "ur"
Cohesion: 0.22
Nodes (10): dr(), fr(), gr(), hcl(), lab(), overwriteGetter(), rgb(), ur() (+2 more)

### Community 34 - "use-child-account.ts"
Cohesion: 0.21
Nodes (18): useFeed(), useFamilyChildren(), useSession(), useTasks(), useChildBalance(), useChildWallet(), useChildAccount(), useFamilyOperations() (+10 more)

### Community 35 - "oe"
Cohesion: 0.11
Nodes (34): A(), b(), C(), D(), E(), ee(), emplaceBack(), f() (+26 more)

### Community 36 - "session/index.ts"
Cohesion: 0.15
Nodes (25): refreshSession(), useMe(), useMyAvatar(), useSessionFamilyId(), bumpSessionEpoch(), epochStorage, loadSession(), pendingLock (+17 more)

### Community 37 - "wallet-query.ts"
Cohesion: 0.27
Nodes (10): fetchParentFunds(), fetchParentPaidTotal(), fetchChildWallet(), fetchWallet(), childWalletQueryOptions(), useParentFunds(), useParentPaidTotal(), useWallet() (+2 more)

### Community 38 - "wishlist.tsx"
Cohesion: 0.08
Nodes (6): MyWishPage(), styles, ACTIONS_GAP, ACTIONS_WIDTH, WishlistPage(), ProfileHeaderProps

### Community 39 - "map/model/types.ts"
Cohesion: 0.09
Nodes (18): backgroundLayer, buildings3dLayer, buildingLayer, houseNumbersLayer, landcoverLayer, landuseLayer, parkLayer, citiesMajorLayer (+10 more)

### Community 40 - "evaluate"
Cohesion: 0.13
Nodes (28): aa(), Ba(), ca(), da(), ea(), fa(), ga(), Gi() (+20 more)

### Community 41 - "populate"
Cohesion: 0.08
Nodes (29): addLineDashDependencies(), calculateGlyphDependencies(), _convertFromCellCoord(), _convertToCellCoord(), ed(), es(), _forEachCell(), getId() (+21 more)

### Community 42 - "react"
Cohesion: 0.04
Nodes (56): react, react-native-svg, ArrowRightIcon(), BagCheckIcon(), BellIcon(), BusIcon(), CalendarIcon(), CameraIcon() (+48 more)

### Community 43 - "mvp-apple-premium.canvas.tsx"
Cohesion: 0.19
Nodes (25): AppleBtn(), AppleField(), AppleLabel(), ApprovalScreen(), BalanceScreen(), ChildTasksScreen(), CreateTaskScreen(), FamilyTheme (+17 more)

### Community 44 - "devDependencies"
Cohesion: 0.09
Nodes (24): { defineConfig }, eslintPluginPrettierRecommended, expoConfig, devDependencies, babel-preset-expo@^57.0.1, eslint@^9.0.0, eslint-config-expo@~56.0.4, eslint-config-prettier@^10.1.8 (+16 more)

### Community 45 - "hx"
Cohesion: 0.08
Nodes (26): ax(), bx(), cx(), dx(), ex(), fx(), gx(), hx() (+18 more)

### Community 46 - "af"
Cohesion: 0.12
Nodes (25): af(), bf(), cf(), df(), ff(), Gf(), Hf(), If() (+17 more)

### Community 47 - "location-connection.tsx"
Cohesion: 0.07
Nodes (39): @tanstack/react-query, changePassword(), Location, ZonePresence, ZonePresenceState, createLocationZone(), deleteLocationZone(), fetchLocationZones() (+31 more)

### Community 48 - "task-sheet.tsx"
Cohesion: 0.08
Nodes (19): Step(), StepProps, TaskChecklistProps, COUNTER_ROOM, TaskNoteField(), TaskNoteFieldProps, TaskNoteProps, HERO_GRADIENTS (+11 more)

### Community 49 - "wallet.ts"
Cohesion: 0.13
Nodes (22): ChildWalletDto, fetchAllEntries(), fetchServerChildWallet(), MemberDto, AnyTransaction, balanceAfter(), CardTransaction, ChildTransaction (+14 more)

### Community 50 - "root-layout.tsx"
Cohesion: 0.09
Nodes (15): expo-font@~56.0.7, @expo-google-fonts/inter@^0.4.2, expo-status-bar@~56.0.4, expo-font, @expo-google-fonts/inter, expo-status-bar, APP_SCREENS, AUTH_SCREENS (+7 more)

### Community 51 - "expo"
Cohesion: 0.09
Nodes (22): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled (+14 more)

### Community 52 - "operation.ts"
Cohesion: 0.19
Nodes (13): fetchOperations(), operationKeys, operationsQueryOptions(), useOperations(), ChildDto, fetchMissed(), fetchServerOperations(), MissedDto (+5 more)

### Community 53 - "family-events-api.ts"
Cohesion: 0.07
Nodes (37): bodyOf(), cancelFamilyEvent(), createFamilyEvent(), FamilyEventDto, FamilyEventPayload, FamilyEventPersonDto, fetchFamilyEvent(), fetchFamilyEvents() (+29 more)

### Community 54 - "ui/rewards-history.tsx"
Cohesion: 0.08
Nodes (23): TransactionsRoute(), formatTransactionAmount(), AMOUNT_STYLES, CardIcon(), ChildTransactionRow(), RowFrame(), RowFrameProps, RowLook (+15 more)

### Community 55 - "auth-api.ts"
Cohesion: 0.15
Nodes (18): deleteMyAvatar(), updateMe(), uploadMyAvatar(), meKeys, AccountKind, ChangePasswordPayload, LoginPayload, MessageResponse (+10 more)

### Community 56 - "mvp-family-premium-mobile.canvas.tsx"
Cohesion: 0.20
Nodes (20): base, Btn(), Field(), Hero(), Img(), MvpFamilyPremiumMobile(), Phone(), PHOTOS (+12 more)

### Community 57 - "determineLineBreaks"
Cohesion: 0.12
Nodes (21): addImageSection(), addTextSection(), _appendSection(), determineAverageLineWidth(), determineLineBreaks(), f_(), g_(), getMaxImageSize() (+13 more)

### Community 58 - "ui/tasks.tsx"
Cohesion: 0.04
Nodes (38): react-native-safe-area-context, authorOf(), ChildHomePage(), greetingKey(), NO_TASKS, EarnGoalCard(), percent(), authorOf() (+30 more)

### Community 59 - "map/map.tsx"
Cohesion: 0.09
Nodes (22): vehicleIcon, createVehiclesLayer(), zonesToGeoJson(), FamilyMarker, later(), MAP_CENTER, MAP_IMAGES, MAP_STYLE_JSON (+14 more)

### Community 60 - "activity-card.tsx"
Cohesion: 0.12
Nodes (15): ActivityCard(), ActivityCardProps, ActivityStatus, ActivityTone, CONNECTORS, GRADIENTS, REWARD_STYLES, STATUS_STYLES (+7 more)

### Community 61 - "transaction-card.tsx"
Cohesion: 0.29
Nodes (15): formatBalance(), formatTransactionTotal(), transactionCode(), BalanceNote(), ChildTransactionCard(), ChildTransactionCardProps, Details(), fullDate() (+7 more)

### Community 62 - "family-task-app-wireframes.canvas.tsx"
Cohesion: 0.25
Nodes (18): ChildAvatar(), CoinBadge(), FamilyIllustration(), FamilyTaskAppWireframes(), GoalProgress(), KidBalanceCard(), KidTaskRow(), ParentBalanceCard() (+10 more)

### Community 63 - "clone"
Cohesion: 0.08
Nodes (27): add(), clone(), div(), divByPoint(), emplace(), filter(), getAndRemove(), _getAndRemoveByKey() (+19 more)

### Community 64 - "layer-preferences.ts"
Cohesion: 0.10
Nodes (23): asBoolean(), asIds(), DEFAULT_CHILD_MARKER_COLOR, DEFAULT_PARENT_MARKER_COLOR, DEFAULT_SECTIONS, DEFAULT_SETTINGS, HIDDEN_FIELD, HiddenLayerKey (+15 more)

### Community 65 - "road-path.ts"
Cohesion: 0.15
Nodes (14): Edge, gridKey(), isRoutable(), lines(), metersBetween(), MinHeap, Node, nodeKey() (+6 more)

### Community 66 - "step1-onboarding-design.canvas.tsx"
Cohesion: 0.29
Nodes (16): AddChildScreenBody(), ChildCard(), ChildScanQrScreenBody(), FamilyIllustration(), Field(), GhostBtn(), ModeTabs(), notes (+8 more)

### Community 67 - "n"
Cohesion: 0.22
Nodes (10): an(), n(), fy(), gy(), hy(), ji(), ki(), kn() (+2 more)

### Community 68 - "constructor"
Cohesion: 0.12
Nodes (17): addImages(), calculateScaledKey(), cc(), constructor(), cv(), _down(), Fu(), initializeIndex() (+9 more)

### Community 69 - "providers/index.tsx"
Cohesion: 0.22
Nodes (9): FRESH_MS, listenAppFocus(), useRefreshOnNavigate(), useServerEvents(), AppEffects(), Providers(), queryClient, LocationConnection() (+1 more)

### Community 70 - "config.ts"
Cohesion: 0.18
Nodes (15): LanguageMenu(), LanguageMenuProps, OPTIONS, detectLanguage(), resources, setLanguage(), useLanguage(), DEFAULT_LANGUAGE (+7 more)

### Community 71 - "pe"
Cohesion: 0.19
Nodes (19): me(), y_(), b(), be(), d(), _e(), f(), ge() (+11 more)

### Community 72 - "validation.ts"
Cohesion: 0.13
Nodes (19): DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH, checkPasswordRules(), FieldError, LoginErrors, LoginForm (+11 more)

### Community 73 - "setPaintProperty"
Cohesion: 0.14
Nodes (15): dc(), fc(), fire(), gradientExpression(), _handleOverridablePaintPropertyUpdate(), _handleSpecialPaintPropertyUpdate(), jd(), listens() (+7 more)

### Community 74 - "paths"
Cohesion: 0.13
Nodes (14): expo/tsconfig.base, compilerOptions, baseUrl, ignoreDeprecations, paths, strict, exclude, extends (+6 more)

### Community 75 - "sortable-list.tsx"
Cohesion: 0.25
Nodes (8): Controller, Layout, RenderArgs, SortableItem(), SortableItemProps, SortableList(), SortableListProps, styles

### Community 76 - "l"
Cohesion: 0.05
Nodes (47): ad(), anchorPoint(), bm(), by(), cd(), cg(), dd(), dt() (+39 more)

### Community 77 - "date-time-picker-sheet.tsx"
Cohesion: 0.18
Nodes (14): clampDate(), is24HourClock(), DateTimePickerSheetProps, HOURS_12, HOURS_24, MINUTES, pad(), PERIODS (+6 more)

### Community 78 - "auth/index.ts"
Cohesion: 0.20
Nodes (15): login(), logout(), register(), resendVerification(), verifyEmail(), useViewerRoleStore, authLog(), forgetSignUp() (+7 more)

### Community 79 - "ui/family-setup.tsx"
Cohesion: 0.15
Nodes (21): RequestError, requestError(), attemptsLeft(), ChangeEmailError, commonError(), confirmEmailChangeError(), info(), requestEmailChangeError() (+13 more)

### Community 80 - "avatar-cropper.tsx"
Cohesion: 0.19
Nodes (12): AvatarCropper(), AvatarCropperProps, clamp(), CropperContent(), Offset, styles, touchDistance(), View2D (+4 more)

### Community 82 - "hasDebugData"
Cohesion: 0.17
Nodes (13): _addCollisionDebugVertex(), addCollisionDebugVertices(), addDebugCollisionBoxes(), destroy(), destroyDebugData(), generateCollisionDebugBuffers(), getVertexAttributes(), hasDebugData() (+5 more)

### Community 83 - "balance-card.tsx"
Cohesion: 0.15
Nodes (5): HERO_COLORS, ProfileHeroProps, styles, BalanceCardProps, GRADIENTS

### Community 84 - "history-map.tsx"
Cohesion: 0.31
Nodes (8): HistoryMapLayer(), HISTORY_GAP_COLOR, HistoryMapProps, HistoryMarker, HistoryPoint, routeSegments(), styles, HistoryMapLayer()

### Community 85 - "zm"
Cohesion: 0.22
Nodes (11): Am(), Dm(), em(), fm(), jm(), km(), Lm(), nm() (+3 more)

### Community 86 - "ui/edit-profile.tsx"
Cohesion: 0.06
Nodes (13): ChangeEmailPage(), goBack(), styles, Props, RequestStep(), EditProfilePage(), PhotoChoice, ProfileHero() (+5 more)

### Community 87 - "en.ts"
Cohesion: 0.21
Nodes (9): i18next@^26.5.8, i18next, CustomTypeOptions, i18next, DeepStrings, Dictionary, en, ExtraPluralForms (+1 more)

### Community 88 - "session-storage.web.ts"
Cohesion: 0.31
Nodes (10): Session, parseSession(), SESSION_KEY, bumpSessionEpoch(), loadSession(), readSessionForRefresh(), removeSession(), saveSession() (+2 more)

### Community 89 - "i"
Cohesion: 0.22
Nodes (11): ac(), ay(), cy(), ic(), id(), ly(), oy(), sy() (+3 more)

### Community 90 - "family-event.tsx"
Cohesion: 0.08
Nodes (31): FeaturedEventCard(), getDayTotals(), getHistoryDays(), isSameDay(), sumTotals(), EMPTY_EVENTS, useFamilyEvents(), capitalize() (+23 more)

### Community 91 - "Expo Router Navigation"
Cohesion: 0.22
Nodes (10): Expo Router Data Loaders, Offline Support and Cancellation, Expo Networking Guidance, Form Sheet Presentation, Route Structure, Native Header Search, Native Tabs, Native Toolbars and Headers (+2 more)

### Community 93 - "Icon"
Cohesion: 0.09
Nodes (38): expo-linear-gradient, formatRewardShort(), isWishlistLimitError(), AddChildSheet(), AddChildSheetProps, createRequestId(), styles, useDeposit() (+30 more)

### Community 94 - "keep-in-view.ts"
Cohesion: 0.32
Nodes (7): currentOffset(), KeepInView, KeepInViewContext, keepInViewScrollStyle, measure(), Rect, useKeepInView()

### Community 95 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, format, format:check, ios, lint, lint:fix, lint:fsd (+2 more)

### Community 96 - "rh"
Cohesion: 0.40
Nodes (5): ah(), ih(), jh(), Mh(), rh()

### Community 97 - "en"
Cohesion: 0.27
Nodes (10): bc(), completeTask(), process(), processTask(), receive(), Sc(), sendAsync(), vc() (+2 more)

### Community 98 - "operation/index.ts"
Cohesion: 0.17
Nodes (12): KindColors, OPERATION_KIND_COLORS, MissedReason, OperationChild, OperationKind, OperationRejection, RewardPayload, KindCube() (+4 more)

### Community 99 - "T"
Cohesion: 0.27
Nodes (11): T(), Y, z, _finishRequestTiming(), _getEtagUnmodifiedResult(), _getExpiryData(), loadData(), loadTile() (+3 more)

### Community 100 - "reject-reason-sheet.tsx"
Cohesion: 0.29
Nodes (10): reviewServerSubmission(), approveTask(), rejectTask(), isDeadlinePassed(), REJECT_COMMENT_MAX_LENGTH, RejectDecision, rejectReasons, reviewError() (+2 more)

### Community 101 - "xt"
Cohesion: 0.15
Nodes (14): dn(), dy(), r(), jn(), off(), On(), once(), transitioned() (+6 more)

### Community 102 - "paint"
Cohesion: 0.22
Nodes (9): gC(), Hc(), hp(), nb(), ng(), paint(), qx(), Vd() (+1 more)

### Community 103 - "lib/index.ts"
Cohesion: 0.08
Nodes (37): DeviceRow(), TaskAssignee, AssigneeAvatar(), AssigneeAvatarProps, styles, ChildReviewRow(), ChildReviewRowProps, ChildTaskTile() (+29 more)

### Community 104 - "ui/calendar.tsx"
Cohesion: 0.11
Nodes (7): CalendarPage(), capitalize(), CreateFamilyEventPage(), EditFamilyEventPage(), FamilyEventFormPage(), FamilyEventFormPageProps, styles

### Community 105 - "wish/index.ts"
Cohesion: 0.05
Nodes (56): expo-file-system, expo-image-manipulator, base(), createServerWish(), deleteServerWish(), fetchServerWishes(), httpsUrl(), reorderServerWishes() (+48 more)

### Community 106 - "Expo Upgrade"
Cohesion: 0.25
Nodes (8): expo-audio Migration, expo-video Migration, Native Tabs Migration, New Architecture, React 19, React Compiler, Expo Router Migration, Expo Upgrade

### Community 107 - "sizes.ts"
Cohesion: 0.31
Nodes (9): CHART_HEIGHT, COLUMN_GAP, COLUMN_WIDTH, COLUMN_WIDTH_SELECTED, DATE_CHIP_HEIGHT, DAY_SLOT_WIDTH, DEPTH_Y, STACK_OVERLAP (+1 more)

### Community 108 - "splitTile"
Cohesion: 0.36
Nodes (8): addTileFeatures(), getTile(), Hh(), initialize(), invalidateTiles(), kh(), splitTile(), updateIndex()

### Community 109 - "use-pair-device.ts"
Cohesion: 0.27
Nodes (9): connectCodeForApi(), pairChildDevice(), usePairDevice(), capitalize(), deviceLabel(), webLabel(), installationId(), storage (+1 more)

### Community 110 - "eh"
Cohesion: 0.20
Nodes (11): eh(), im(), lh(), nh(), qm(), Sm(), th(), wm() (+3 more)

### Community 111 - "family-color-palettes.canvas.tsx"
Cohesion: 0.35
Nodes (10): BASE, FamilyColorPalettes(), FamilyTheme, MiniPhone(), SOFT, Swatch(), ThemeCardClean(), THEMES (+2 more)

### Community 112 - "canvases/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 113 - "oh"
Cohesion: 0.25
Nodes (9): ch(), dh(), fh(), filterUpdate(), oh(), ph(), sh(), uh() (+1 more)

### Community 114 - "ui/family.tsx"
Cohesion: 0.05
Nodes (16): NO_OPERATIONS, NO_TASKS, ChildWishPage(), ChildWishlistPage(), styles, FamilyPage(), NO_MEMBERS, NO_TASKS (+8 more)

### Community 115 - "interpolate"
Cohesion: 0.33
Nodes (7): hg(), hr(), interpolate(), mr(), Or(), pr(), _r()

### Community 116 - "react-native"
Cohesion: 0.05
Nodes (68): react-native, CHECKLIST_MAX_ITEMS, ChildChip(), ChildChipProps, ChipChild, depositFunds(), ParentWalletDto, toFunds() (+60 more)

### Community 117 - "user/index.ts"
Cohesion: 0.11
Nodes (26): ROLE_COLORS, RoleColors, Child, ChildProfile, ParentProfile, GeoPoint, Presence, FamilyRole (+18 more)

### Community 118 - "en"
Cohesion: 0.22
Nodes (11): Cn(), en(), hn(), mn(), nn(), qt(), rn(), Sn() (+3 more)

### Community 119 - "obsidian-done/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 120 - "missed-task-tile.tsx"
Cohesion: 0.16
Nodes (8): MissedTaskTile(), MissedTaskTileProps, sameDay(), styles, PaidTaskTile(), PaidTaskTileProps, sameDay(), styles

### Community 121 - "appendLeaves"
Cohesion: 0.33
Nodes (6): appendLeaves(), getChildren(), getClusterExpansionZoom(), getLeaves(), getOriginId(), getOriginZoom()

### Community 122 - "getColorRampTextures"
Cohesion: 0.33
Nodes (6): _colorRampChanged(), _createColorRamp(), getColorRampTextures(), getUnpackVector(), Kd(), pack()

### Community 123 - "layout"
Cohesion: 0.33
Nodes (6): eg(), hd(), layout(), pp(), qy(), um()

### Community 124 - "addFeature"
Cohesion: 0.08
Nodes (32): addCurrentVertex(), addFeature(), addFeatures(), addHalfVertex(), addLine(), ai(), cm(), cp() (+24 more)

### Community 125 - "bar-3d.tsx"
Cohesion: 0.17
Nodes (9): DEPTH_X, FUTURE_BAR_HEIGHT, Bar3DProps, Block, Cube(), CubeColors, CubeProps, FUTURE_COLORS (+1 more)

### Community 126 - "DoneReceived Project Guidance"
Cohesion: 0.40
Nodes (3): Mobile API Security Checklist, Repository Skill Catalog, DoneReceived Project Guidance

### Community 127 - "metro.config.js"
Cohesion: 0.29
Nodes (5): config, { getDefaultConfig }, expo@~56.0.22, { withAppBuildGradle }, expo

### Community 128 - "Seven-Step Task Definition Form"
Cohesion: 0.40
Nodes (5): Reward and Penalty Configuration, Deadline and Recurrence Configuration, Task Creation Screen, Seven-Step Task Definition Form, Task Image and Icon Selection

### Community 129 - "kb"
Cohesion: 0.40
Nodes (5): Ab(), Fb(), jb(), kb(), ob()

### Community 130 - "family-color-palettes-new.canvas.tsx"
Cohesion: 0.44
Nodes (8): FamilyColorPalettesNew(), FamilyTheme, MiniPhone(), Swatch(), ThemePreview(), THEMES, tint(), WelcomeBlock()

### Community 131 - "_refreshViews"
Cohesion: 0.40
Nodes (5): freeBufferAfterUpload(), _refreshViews(), reserve(), resize(), _trim()

### Community 132 - "update"
Cohesion: 0.40
Nodes (5): update(), _updateDomImage(), _updateRawData(), _uploadDomImage(), _uploadRawData()

### Community 133 - "src_shared_api_index_authorizedimage"
Cohesion: 0.24
Nodes (7): ChildDto, fetchAllTransactions(), fetchServerWallet(), TransactionsDto, Transaction, OPTIONAL_REQUEST_TIMEOUT_MS, withTimeout()

### Community 134 - "earn-goal-card.tsx"
Cohesion: 0.22
Nodes (4): EarnGoalCardProps, Goal, styles, styles

### Community 135 - "Task Reward Lifecycle"
Cohesion: 0.50
Nodes (4): Family Wallet MVP Architecture, Task Reward Lifecycle, Task Creator Mockup, Parent Child Reward MVP Flow

### Community 136 - "Gamified Household Task Profile Dashboard"
Cohesion: 0.67
Nodes (4): Achievement Tracking, Gamified Household Task Profile Dashboard, User Progress Summary, Reward and Penalty Ledger

### Community 137 - "Child Device Pairing Codes"
Cohesion: 0.50
Nodes (3): Family Roles and Permissions, DoneReceived Codex Skill Strategy, DoneReceived Client State Stack

### Community 138 - "Retryable Task Rejection"
Cohesion: 0.50
Nodes (3): Retryable Task Rejection, Task Submission Comment, Per-Assignment Task Checklist

### Community 139 - "wrap"
Cohesion: 0.50
Nodes (4): bt(), distance(), pointOnLine(), wrap()

### Community 141 - "createIndex"
Cohesion: 0.50
Nodes (4): cluster(), createIndex(), createTree(), load()

### Community 142 - "ot"
Cohesion: 0.50
Nodes (4): de(), ot(), pe(), ve()

### Community 143 - "Dp"
Cohesion: 0.50
Nodes (4): Dp(), geometry(), projectLine(), projectPoint()

### Community 144 - "getClustersInternal"
Cohesion: 0.50
Nodes (4): getClusters(), getClustersInternal(), limitZoom(), wh()

### Community 145 - "ov"
Cohesion: 0.50
Nodes (4): ov(), patchUpdatedImage(), patchUpdatedImages(), sv()

### Community 146 - "setValue"
Cohesion: 0.67
Nodes (4): _propertyRootKey(), setTransition(), setValue(), setValues()

### Community 149 - "Frontend JavaScript Security"
Cohesion: 1.00
Nodes (3): Frontend JavaScript Security, React Web Security, Security Best Practices

### Community 151 - "Android Icon Background Template"
Cohesion: 1.00
Nodes (3): Android Icon Background Template, Center Alignment Guides, Circular Icon Safe Zones

### Community 152 - "Application Favicon"
Cohesion: 1.00
Nodes (3): Application Favicon, Blue Chevron Brand Mark, Rounded Square Icon Tile

### Community 153 - "sortFeatures"
Cohesion: 0.67
Nodes (3): addIndicesForPlacedSymbol(), getSortedSymbolIndexes(), sortFeatures()

### Community 154 - "bb"
Cohesion: 0.67
Nodes (3): bb(), url(), xb()

### Community 155 - "geometryType"
Cohesion: 0.67
Nodes (3): containsPolygonGeometry(), geometryType(), getGeometries()

### Community 156 - "empty"
Cohesion: 0.67
Nodes (3): covers(), empty(), intersects()

### Community 157 - "prepareSegment"
Cohesion: 0.67
Nodes (3): createNewSegment(), getOrCreateLatestSegment(), prepareSegment()

### Community 158 - "_unit"
Cohesion: 0.67
Nodes (3): _div(), mag(), _unit()

### Community 159 - "withinInto"
Cohesion: 0.67
Nodes (3): within(), withinInto(), xh()

### Community 160 - "ui/rewards-history.tsx"
Cohesion: 0.04
Nodes (22): HomeRoute(), RewardsHistoryRoute(), TasksRoute(), WalletRoute(), useViewerRole(), greetingKey(), ParentHomePage(), ChildRewardsHistoryPage() (+14 more)

### Community 186 - "ref_cursor"
Cohesion: 0.36
Nodes (6): MainScreensComparison(), Phone(), Theme, ThemeRow(), THEMES, tint()

### Community 187 - "expo-router"
Cohesion: 0.22
Nodes (9): expo-router, BottomNavItem, NAV_ITEMS, BottomNav(), BottomNavProps, NAV_PADDING_VERTICAL, styles, TabScreen() (+1 more)

### Community 188 - "children-carousel.tsx"
Cohesion: 0.24
Nodes (8): SnapCarouselOptions, useSnapCarousel(), ChildrenCarousel(), ChildrenCarouselProps, CAROUSEL_GAP, CAROUSEL_GUTTER, CAROUSEL_PEEK, styles

### Community 190 - "get"
Cohesion: 0.29
Nodes (8): backfillBorder(), get(), _getByteView(), getPixels(), _idx(), sampleBilinear(), unpack(), _unpackAtIndex()

### Community 191 - "featured-event-card.tsx"
Cohesion: 0.27
Nodes (5): styles, EventRowProps, EventTile(), EventTileProps, FeaturedEventCardProps

### Community 192 - "activity-card.tsx"
Cohesion: 0.15
Nodes (15): ActivityDto, ChildDto, fetchClosedAssignments(), fetchFeed(), isLastRejection(), KNOWN, MemberDto, MissedDto (+7 more)

### Community 193 - "_h"
Cohesion: 0.40
Nodes (5): bh(), finish(), _h(), vh(), yh()

### Community 194 - "parse"
Cohesion: 0.32
Nodes (8): checkSubtype(), concat(), error(), parse(), _parse(), r(), Qn(), tr()

### Community 195 - "period-select.tsx"
Cohesion: 0.24
Nodes (5): operationsInPeriod(), PERIOD_DAYS, SUMMARY_PERIODS, SummaryPeriod, PeriodSelectProps

### Community 196 - "session-refresh-lock.ts"
Cohesion: 0.53
Nodes (5): lockFile, release(), tryAcquire(), wait(), withRefreshLock()

### Community 197 - "zustand"
Cohesion: 0.33
Nodes (4): zustand@^5.0.14, zustand, ToastState, useToastStore

### Community 199 - "field-hint.tsx"
Cohesion: 0.50
Nodes (3): FieldHintProps, HintTone, styles

### Community 200 - "count-tasks.ts"
Cohesion: 0.60
Nodes (4): countChildTasks(), countTasks(), filterTasks(), TaskFilter

### Community 201 - "copyText"
Cohesion: 0.50
Nodes (3): expo-clipboard@~56.0.4, expo-clipboard, copyText()

### Community 202 - "xr"
Cohesion: 0.33
Nodes (7): br(), Cr(), lr(), Sr(), vr(), wr(), xr()

### Community 203 - "checklist-field.styled.ts"
Cohesion: 0.50
Nodes (3): styles, webInputReset, webNoOutline

### Community 206 - "photo-viewer.tsx"
Cohesion: 0.11
Nodes (18): ChildAccountFound(), styles, ChildCodeField(), ChildCodeFieldProps, styles, ApiImage(), HeaderSource, headerSource() (+10 more)

### Community 207 - "section-header.tsx"
Cohesion: 0.32
Nodes (6): ScreenSection(), ScreenSectionProps, styles, SectionHeader(), SectionHeaderProps, styles

### Community 210 - "evaluate"
Cohesion: 0.33
Nodes (6): _calculate(), er(), evaluate(), gt(), ko(), possiblyEvaluate()

### Community 223 - "swipeable-row.tsx"
Cohesion: 0.50
Nodes (4): rubberBand(), styles, SwipeableRow(), SwipeableRowProps

### Community 256 - "reward-kind-toggle.tsx"
Cohesion: 0.07
Nodes (21): BadgeSize, GRADIENTS, ICON_SIZE, styles, TaskIconBadgeProps, themedValue(), GRADIENTS, Option (+13 more)

## Knowledge Gaps
- **45 isolated node(s):** `Cancelled`, `Done`, `Pending`, `expo/tsconfig.base`, `expo-audio Migration` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1259 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **56 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `tracking`, `zones.ts`, `child-card.tsx`, `ui/family-setup.tsx`, `package.json`, `useCurrentFamily`, `tasks-header.tsx`, `child-task-card.tsx`, `use-child-location-sharing.ts`, `ui/index.ts`, `ui/map-layers.tsx`, `location-sharing-card.tsx`, `confirm-step.tsx`, `mvp-full-design-variants.canvas.tsx`, `http.ts`, `parent-invite-code.tsx`, `useTheme`, `auth-layout.tsx`, `ui/change-password.tsx`, `device-api.ts`, `bus-playback.ts`, `use-child-account.ts`, `session/index.ts`, `wishlist.tsx`, `mvp-apple-premium.canvas.tsx`, `location-connection.tsx`, `task-sheet.tsx`, `root-layout.tsx`, `family-events-api.ts`, `ui/rewards-history.tsx`, `mvp-family-premium-mobile.canvas.tsx`, `ui/tasks.tsx`, `map/map.tsx`, `activity-card.tsx`, `transaction-card.tsx`, `family-task-app-wireframes.canvas.tsx`, `layer-preferences.ts`, `step1-onboarding-design.canvas.tsx`, `providers/index.tsx`, `sortable-list.tsx`, `date-time-picker-sheet.tsx`, `avatar-cropper.tsx`, `history-map.tsx`, `ui/edit-profile.tsx`, `family-event.tsx`, `Icon`, `keep-in-view.ts`, `operation/index.ts`, `reject-reason-sheet.tsx`, `lib/index.ts`, `ui/calendar.tsx`, `wish/index.ts`, `sizes.ts`, `family-color-palettes.canvas.tsx`, `canvases/mvp-c4-business-logic.canvas.tsx`, `ui/family.tsx`, `react-native`, `user/index.ts`, `obsidian-done/mvp-c4-business-logic.canvas.tsx`, `family-color-palettes-new.canvas.tsx`, `earn-goal-card.tsx`, `ui/rewards-history.tsx`, `ref_cursor`, `expo-router`, `children-carousel.tsx`, `period-select.tsx`, `star.tsx`, `arrow-left.tsx`, `badge-check.tsx`, `photo-viewer.tsx`, `section-header.tsx`, `code.tsx`, `copy.tsx`, `swipeable-row.tsx`, `eye.tsx`, `refresh.tsx`, `chevron-down.tsx`, `help.tsx`, `person.tsx`, `step-dot.tsx`, `trash.tsx`, `reward-kind-toggle.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **What connects `Cancelled`, `Done`, `Pending` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `maplibre-gl-shared.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005952380952380952 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `reward-kind-toggle.tsx`, `tracking`, `zones.ts`, `child-card.tsx`, `server-tasks-api.ts`, `operations-chart.tsx`, `ui/family-setup.tsx`, `package.json`, `withAlpha`, `earn-goal-card.tsx`, `useCurrentFamily`, `tasks-header.tsx`, `child-task-card.tsx`, `use-child-location-sharing.ts`, `ui/index.ts`, `ui/map-layers.tsx`, `location-sharing-card.tsx`, `confirm-step.tsx`, `http.ts`, `parent-invite-code.tsx`, `useTheme`, `auth-layout.tsx`, `ui/change-password.tsx`, `device-api.ts`, `ui/rewards-history.tsx`, `use-child-account.ts`, `session/index.ts`, `wishlist.tsx`, `task-sheet.tsx`, `wallet.ts`, `root-layout.tsx`, `family-events-api.ts`, `ui/rewards-history.tsx`, `ui/tasks.tsx`, `expo-router`, `activity-card.tsx`, `children-carousel.tsx`, `map/map.tsx`, `featured-event-card.tsx`, `activity-card.tsx`, `layer-preferences.ts`, `transaction-card.tsx`, `period-select.tsx`, `providers/index.tsx`, `field-hint.tsx`, `validation.ts`, `checklist-field.styled.ts`, `sortable-list.tsx`, `date-time-picker-sheet.tsx`, `photo-viewer.tsx`, `section-header.tsx`, `avatar-cropper.tsx`, `balance-card.tsx`, `history-map.tsx`, `ui/edit-profile.tsx`, `family-event.tsx`, `Icon`, `keep-in-view.ts`, `swipeable-row.tsx`, `operation/index.ts`, `reject-reason-sheet.tsx`, `lib/index.ts`, `ui/calendar.tsx`, `wish/index.ts`, `sizes.ts`, `use-pair-device.ts`, `ui/family.tsx`, `user/index.ts`, `missed-task-tile.tsx`, `bar-3d.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `tracking` be split into smaller, more focused modules?**
  _Cohesion score 0.04632867132867133 - nodes in this community are weakly interconnected._
- **Why does `maplibre-gl` connect `zones.ts` to `road-path.ts`, `map/model/types.ts`, `package.json`, `lib/index.ts`, `history-map.tsx`, `user/index.ts`, `map/map.tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Should `zones.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06382978723404255 - nodes in this community are weakly interconnected._