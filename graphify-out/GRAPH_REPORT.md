# Graph Report - doneReceived  (2026-11-16)

## Corpus Check
- 737 files · ~238,702 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .graphify-bak 1, .base 1)

## Summary
- 3860 nodes · 10478 edges · 198 communities (155 shown, 43 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 288 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c742c8f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- maplibre-gl-shared.mjs
- react-native
- ui/index.ts
- ui/map-layers.tsx
- server-tasks-api.ts
- ui/transactions.tsx
- user/index.ts
- package.json
- wish-form-sheet.tsx
- maplibre-gl-worker.mjs
- ds
- ui/family.tsx
- lib/index.ts
- my-tasks.tsx
- yt
- subdividePolygonInternal
- ui/tasks.tsx
- api/index.ts
- fw
- day-column.tsx
- child-task-card.tsx
- child-home.tsx
- readPackedEnd
- mvp-full-design-variants.canvas.tsx
- ui/change-password.tsx
- writeTag
- ui/family-setup.tsx
- showToast
- operation/index.ts
- task-form-screen.tsx
- entities/family/index.ts
- ui/role-select.tsx
- bus-playback.ts
- parse
- zones.ts
- oe
- auth-api.ts
- isApiError
- ui/verify-email.tsx
- map/model/types.ts
- evaluate
- populate
- react
- mvp-apple-premium.canvas.tsx
- devDependencies
- hx
- af
- feed-api.ts
- date-time-picker-sheet.tsx
- root-layout.tsx
- showToast
- expo
- child-devices.tsx
- create-task-form.tsx
- map.web.tsx
- road-path.ts
- mvp-family-premium-mobile.canvas.tsx
- determineLineBreaks
- reject-reason-sheet.tsx
- avatar-cropper.tsx
- config.ts
- PickedPhoto
- family-task-app-wireframes.canvas.tsx
- clone
- map-layers-panel.tsx
- use-register-parent-device.ts
- step1-onboarding-design.canvas.tsx
- n
- constructor
- use-wishlist-progress.ts
- role-routes.tsx
- pe
- ui/map-zone.tsx
- setPaintProperty
- paths
- parent-invite-code.tsx
- l
- auth-api.ts
- LetterAvatar
- ui/family.tsx
- use-register-parent-device.ts
- hasDebugData
- ui/registration.tsx
- en.ts
- zm
- queryIntersectsFeature
- expo-linear-gradient
- family-color-palettes.canvas.tsx
- i
- jy
- Expo Router Navigation
- React Native Best Practices
- canvases/mvp-c4-business-logic.canvas.tsx
- obsidian-done/mvp-c4-business-logic.canvas.tsx
- scripts
- eh
- en
- i18n/index.ts
- T
- family-color-palettes-new.canvas.tsx
- loadAndProcessGeoJSON
- paint
- task/index.ts
- transaction-card.tsx
- transfer-ownership-button.tsx
- Expo Upgrade
- ref_cursor
- splitTile
- get
- eh
- activity-card.tsx
- Wu
- oh
- xt
- interpolate
- child-wallet.tsx
- api-image.web.tsx
- en
- tasks-query.ts
- day-summary.tsx
- appendLeaves
- getColorRampTextures
- layout
- ii
- _h
- DoneReceived Project Guidance
- metro.config.js
- Seven-Step Task Definition Form
- kb
- task-short-view.tsx
- _refreshViews
- update
- queryRadius
- day-column.tsx
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
- bar-3d.tsx
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
- task-list.tsx
- I18n and Accessibility Checklist
- Apache License 2.0
- Modern React Native Styling Patterns
- Blue Upward Chevron App Mark
- Monochrome Upward Chevron App Mark
- Geometric Blue Chevron App Icon
- User Profile Concept
- Child Location and Zones
- Repository Commit Format

## God Nodes (most connected - your core abstractions)
1. `react-native` - 267 edges
2. `react` - 190 edges
3. `theme` - 176 edges
4. `Icon()` - 129 edges
5. `tracking()` - 103 edges
6. `react-native-svg` - 64 edges
7. `@tanstack/react-query` - 48 edges
8. `showToast()` - 47 edges
9. `expo-linear-gradient` - 44 edges
10. `apiRequest()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `useJoinFamily()` --indirect_call--> `joinFamilyByCode()`  [INFERRED]
  src/features/join-family/model/use-join-family.ts → src/entities/family/api/families-api.ts
- `Repository Skill Catalog` --references--> `DoneReceived Project Guidance`  [EXTRACTED]
  .claude/skills/README.md → CLAUDE.md
- `Client State Boundaries` --references--> `DoneReceived Project Guidance`  [EXTRACTED]
  .claude/skills/dr-client-state/SKILL.md → CLAUDE.md
- `Parent Child Reward MVP Flow` --semantically_similar_to--> `Task Reward Lifecycle`  [INFERRED] [semantically similar]
  obsidian-done/Сделал-получил/MVP.md → obsidian-done/C4.md
- `Frontend JavaScript Security` --semantically_similar_to--> `React Web Security`  [INFERRED] [semantically similar]
  .claude/skills/security-best-practices/references/javascript-general-web-frontend-security.md → .claude/skills/security-best-practices/references/javascript-typescript-react-web-frontend-security.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gamified Task Profile Metrics** — obsidian_done_z_исходники_картинки_pasted_image_20260710153839_progress_summary, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_reward_penalty_ledger, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_achievement_tracking [EXTRACTED 1.00]
- **React Native Animation Rules** — _claude_skills_vercel_react_native_skills_rules_animation_derived_value_use_derived_value, _claude_skills_vercel_react_native_skills_rules_animation_gesture_detector_press_gesture_press, _claude_skills_vercel_react_native_skills_rules_animation_gpu_properties_gpu_animation [EXTRACTED 1.00]
- **Task Completion and Reward Flow** — obsidian_done_c4_task_lifecycle, obsidian_done_сделал_получил_mvp_parent_child_reward_flow, obsidian_done_сделал_получил_идеи_retryable_rejection, obsidian_done_сделал_получил_идеи_wallet_reservation_invariant [INFERRED 0.95]

## Communities (198 total, 43 thin omitted)

### Community 0 - "maplibre-gl-shared.mjs"
Cohesion: 0.01
Nodes (83): Ag, Ar, As, aT, b_, Bn, bp, BS (+75 more)

### Community 1 - "react-native"
Cohesion: 0.06
Nodes (29): react-native, PeriodSelectProps, styles, FieldHintProps, styles, webInputReset, webNoOutline, RewardBudgetProps (+21 more)

### Community 2 - "ui/index.ts"
Cohesion: 0.05
Nodes (40): AuthFootnoteProps, AuthLayoutProps, styles, Button(), ButtonProps, ButtonState, styles, CardButtonProps (+32 more)

### Community 3 - "ui/map-layers.tsx"
Cohesion: 0.08
Nodes (30): deleteLocationZone(), busRouteKey(), isSnapshot(), useBusesSocket(), connect(), useMemberMapSettings(), useUpdateMemberMapSettings(), AddRow() (+22 more)

### Community 4 - "server-tasks-api.ts"
Cohesion: 0.07
Nodes (41): AssignmentDto, AttachmentDto, attachmentImage(), checklistBody(), ChildDto, createServerTask(), fetchServerTasks(), LastRejectionDto (+33 more)

### Community 5 - "ui/transactions.tsx"
Cohesion: 0.07
Nodes (55): TransactionsRoute(), ChildWalletDto, fetchServerChildWallet(), MemberDto, ChildDto, fetchServerWallet(), TransactionsDto, fetchChildWallet() (+47 more)

### Community 6 - "user/index.ts"
Cohesion: 0.08
Nodes (36): ROLE_COLORS, RoleColors, Child, ChildProfile, Location, ZonePresence, ZonePresenceState, ParentProfile (+28 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (56): dependencies, @deck.gl/core@^9.4.0, @deck.gl/layers@^9.4.0, @deck.gl/mapbox@^9.4.0, expo-clipboard@~56.0.4, expo-constants@~56.0.27, expo-dev-client@~56.0.27, expo-file-system@~56.0.11 (+48 more)

### Community 8 - "wish-form-sheet.tsx"
Cohesion: 0.10
Nodes (36): base(), createServerWish(), deleteServerWish(), fetchServerWishes(), httpsUrl(), reorderServerWishes(), saveServerWishPhotos(), toBody() (+28 more)

### Community 9 - "maplibre-gl-worker.mjs"
Cohesion: 0.05
Nodes (31): ae(), cn, Db(), et(), I, lb(), li, ln() (+23 more)

### Community 10 - "ds"
Cohesion: 0.07
Nodes (52): ao(), as(), bo(), bs(), co(), cs(), Do(), ds() (+44 more)

### Community 11 - "ui/family.tsx"
Cohesion: 0.09
Nodes (42): useFamilyChildren(), useFamilyMembers(), getDayTotals(), getHistoryDays(), isSameDay(), latestRewards(), sumTotals(), operationsInPeriod() (+34 more)

### Community 12 - "lib/index.ts"
Cohesion: 0.09
Nodes (36): formatRewardShort(), TaskAssignee, AssigneeAvatar(), AssigneeAvatarProps, styles, ChildReviewRow(), ChildReviewRowProps, styles (+28 more)

### Community 13 - "my-tasks.tsx"
Cohesion: 0.13
Nodes (25): expo-router, useChildBalance(), useWishlistProgress(), WishRow(), useMyChildBalance(), useMyWishlistOwner(), useWishlistChild(), WishlistChild (+17 more)

### Community 14 - "yt"
Cohesion: 0.05
Nodes (48): A_(), addFeatures(), av(), bv(), Cu(), D_(), detectSdfPatterns(), Dv() (+40 more)

### Community 15 - "subdividePolygonInternal"
Cohesion: 0.05
Nodes (48): addCurrentVertex(), addFeature(), addHalfVertex(), addLine(), ap(), Bp(), cm(), cp() (+40 more)

### Community 16 - "ui/tasks.tsx"
Cohesion: 0.09
Nodes (25): authorOf(), ChildTasksPage(), NO_TASKS, ParentTasksPage(), CARDS_PADDING_BOTTOM, styles, TasksPage(), TasksScope (+17 more)

### Community 17 - "api/index.ts"
Cohesion: 0.13
Nodes (21): @tanstack/react-query, revokeDevice(), createChild(), deleteChild(), revokeParentInvite(), setChildAvatar(), useCurrentFamily(), createTask() (+13 more)

### Community 18 - "fw"
Cohesion: 0.05
Nodes (43): Aw(), bw(), _C(), Cw(), decodeDictionary(), du(), Dw(), ew() (+35 more)

### Community 19 - "day-column.tsx"
Cohesion: 0.19
Nodes (15): CHART_HEIGHT, COLUMN_GAP, COLUMN_WIDTH, COLUMN_WIDTH_SELECTED, DATE_CHIP_HEIGHT, DAY_SLOT_WIDTH, DEPTH_Y, STACK_OVERLAP (+7 more)

### Community 20 - "child-task-card.tsx"
Cohesion: 0.08
Nodes (56): ChecklistItem, ChildTaskCard(), ChildTaskCardProps, PhotoSource(), PhotoSourceProps, ReportPhotos, styles, TaskCard() (+48 more)

### Community 21 - "child-home.tsx"
Cohesion: 0.08
Nodes (19): useMe(), useMyAvatar(), useSessionFamilyId(), useSession(), useSessionUser(), useChildAccount(), useFamilyOperations(), useFamilyFeed() (+11 more)

### Community 22 - "readPackedEnd"
Cohesion: 0.06
Nodes (39): bg(), ev(), Fg(), $i(), Ig(), jg(), Lg(), Mg() (+31 more)

### Community 23 - "mvp-full-design-variants.canvas.tsx"
Cohesion: 0.16
Nodes (37): BalanceUpdatedScreen(), BroomIcon(), Btn(), CameraScanArt(), ChildScanScreen(), ChildTasksScreen(), CoinStackArt(), CreateTaskScreen() (+29 more)

### Community 24 - "ui/change-password.tsx"
Cohesion: 0.09
Nodes (26): changePassword(), DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH, checkPasswordRules(), FieldError, LoginErrors (+18 more)

### Community 25 - "writeTag"
Cohesion: 0.07
Nodes (37): q_(), realloc(), tv(), writeBoolean(), writeBooleanField(), writeBytes(), writeBytesField(), writeDouble() (+29 more)

### Community 26 - "ui/family-setup.tsx"
Cohesion: 0.11
Nodes (25): useFamilyInvitePreview(), formatInviteCode(), INVITE_CODE_TEMPLATE, InviteRole, isCompleteInviteCode(), RoleIcon(), FoundInvite, InviteCodeState (+17 more)

### Community 27 - "showToast"
Cohesion: 0.12
Nodes (21): JoinFamilyPanel(), LanguageMenu(), LanguageMenuProps, OPTIONS, EditProfilePage(), PhotoChoice, styles, ProfileHero() (+13 more)

### Community 28 - "operation/index.ts"
Cohesion: 0.14
Nodes (18): fetchOperations(), operationKeys, operationsQueryOptions(), useOperations(), ChildDto, fetchServerOperations(), MissedDto, OperationsViewer (+10 more)

### Community 29 - "task-form-screen.tsx"
Cohesion: 0.26
Nodes (6): useParentFunds(), CreateTaskPage(), styles, EditTaskPage(), TaskFormScreen(), TaskFormScreenProps

### Community 30 - "entities/family/index.ts"
Cohesion: 0.08
Nodes (38): createFamily(), createParentInvite(), FamilyDetailsDto, fetchFamilyChildren(), fetchFamilyDetails(), fetchFamilyMembers(), fetchMyFamilies(), joinFamilyByCode() (+30 more)

### Community 31 - "ui/role-select.tsx"
Cohesion: 0.09
Nodes (30): DeviceDto, fetchChildDevices(), fetchConnectCode(), PreviewDto, previewPairing(), codeLeft(), deviceKeys, useChildDevices() (+22 more)

### Community 32 - "bus-playback.ts"
Cohesion: 0.12
Nodes (24): Bus, RoadMovement, VehicleSnapshot, bearingAt(), bearingBetween(), bearingOnSegment(), BusPlayback, catchUpRate() (+16 more)

### Community 33 - "parse"
Cohesion: 0.08
Nodes (31): br(), _calculate(), checkSubtype(), concat(), Cr(), dr(), er(), error() (+23 more)

### Community 34 - "zones.ts"
Cohesion: 0.09
Nodes (25): maplibre-gl@6.10.0, maplibre-gl, OSM_SOURCE, MAP_STYLE, draftFillLayer, draftLineLayer, draftPointsLayer, ZONE_DRAFT_LAYER_IDS (+17 more)

### Community 35 - "oe"
Cohesion: 0.15
Nodes (29): b(), C(), D(), E(), ee(), emplaceBack(), f(), g() (+21 more)

### Community 36 - "auth-api.ts"
Cohesion: 0.18
Nodes (13): refreshSession(), Session, loadSession(), removeSession(), saveSession(), parseSession(), SESSION_KEY, loadSession() (+5 more)

### Community 37 - "isApiError"
Cohesion: 0.19
Nodes (13): RequestError, ChangePasswordError, changePasswordError(), errorCode(), hasCode(), joinError(), attemptsLeft(), createFamilyError() (+5 more)

### Community 38 - "ui/verify-email.tsx"
Cohesion: 0.15
Nodes (20): login(), logout(), register(), resendVerification(), verifyEmail(), useViewerRoleStore, authLog(), forgetSignUp() (+12 more)

### Community 39 - "map/model/types.ts"
Cohesion: 0.09
Nodes (18): backgroundLayer, buildings3dLayer, buildingLayer, houseNumbersLayer, landcoverLayer, landuseLayer, parkLayer, citiesMajorLayer (+10 more)

### Community 40 - "evaluate"
Cohesion: 0.13
Nodes (28): aa(), Ba(), ca(), da(), ea(), fa(), ga(), Gi() (+20 more)

### Community 41 - "populate"
Cohesion: 0.08
Nodes (28): addLineDashDependencies(), calculateGlyphDependencies(), _convertFromCellCoord(), _convertToCellCoord(), ed(), es(), _forEachCell(), getId() (+20 more)

### Community 42 - "react"
Cohesion: 0.04
Nodes (62): react, react-native-svg, ArrowLeftIcon(), ArrowRightIcon(), BagCheckIcon(), BellIcon(), BusIcon(), CalendarIcon() (+54 more)

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

### Community 47 - "feed-api.ts"
Cohesion: 0.17
Nodes (12): ActivityDto, ChildDto, fetchFeed(), KNOWN, MemberDto, FEED_LIMIT, feedKeys, useFeed() (+4 more)

### Community 48 - "date-time-picker-sheet.tsx"
Cohesion: 0.14
Nodes (20): clampDate(), endOfDay(), formatCountdown(), formatDate(), is24HourClock(), locale(), pad(), DateTimePickerSheetProps (+12 more)

### Community 49 - "root-layout.tsx"
Cohesion: 0.11
Nodes (16): FRESH_MS, listenAppFocus(), useRefreshOnNavigate(), ParentDeviceRegistration(), Providers(), queryClient, useTaskExpirationEvents(), APP_SCREENS (+8 more)

### Community 50 - "showToast"
Cohesion: 0.17
Nodes (19): AddChildSheet(), AddChildSheetProps, styles, useDeleteWish(), DepositSheet(), DepositSheetProps, PRESETS, styles (+11 more)

### Community 51 - "expo"
Cohesion: 0.09
Nodes (21): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+13 more)

### Community 52 - "child-devices.tsx"
Cohesion: 0.15
Nodes (14): DeviceRow(), DeviceRowProps, styles, ConnectDevicePanel(), ConnectDevicePanelProps, formatLeft(), pad(), styles (+6 more)

### Community 53 - "create-task-form.tsx"
Cohesion: 0.05
Nodes (56): REWARD_PRESETS, buildCreateTaskPayload(), ChecklistDraftStep, checklistPayload(), FormActions, FormState, initialState, stepKey() (+48 more)

### Community 54 - "map.web.tsx"
Cohesion: 0.12
Nodes (14): vehicleIcon, createVehiclesLayer(), zonesToGeoJson(), later(), MapWeb(), draw(), onMove(), refreshRoads() (+6 more)

### Community 55 - "road-path.ts"
Cohesion: 0.15
Nodes (14): Edge, gridKey(), isRoutable(), lines(), metersBetween(), MinHeap, Node, nodeKey() (+6 more)

### Community 56 - "mvp-family-premium-mobile.canvas.tsx"
Cohesion: 0.20
Nodes (20): base, Btn(), Field(), Hero(), Img(), MvpFamilyPremiumMobile(), Phone(), PHOTOS (+12 more)

### Community 57 - "determineLineBreaks"
Cohesion: 0.12
Nodes (21): addImageSection(), addTextSection(), _appendSection(), determineAverageLineWidth(), determineLineBreaks(), f_(), g_(), getMaxImageSize() (+13 more)

### Community 58 - "reject-reason-sheet.tsx"
Cohesion: 0.21
Nodes (15): reviewServerSubmission(), approveTask(), family(), rejectTask(), isCommentRequired(), isDeadlinePassed(), REJECT_COMMENT_MAX_LENGTH, RejectDecision (+7 more)

### Community 59 - "avatar-cropper.tsx"
Cohesion: 0.22
Nodes (13): cropPhoto(), AvatarCropper(), AvatarCropperProps, clamp(), CropperContent(), Offset, styles, touchDistance() (+5 more)

### Community 60 - "config.ts"
Cohesion: 0.18
Nodes (16): expo-localization@~56.0.6, react-i18next@^17.1.6, react-native-mmkv@^4.3.2, expo-localization, react-i18next, react-native-mmkv, detectLanguage(), resources (+8 more)

### Community 61 - "PickedPhoto"
Cohesion: 0.13
Nodes (12): expo-image-manipulator, CropRect, RemoteSource, RemoteSource, PhotoPermissionError, PhotoSource, PickedPhoto, pickPhotos() (+4 more)

### Community 62 - "family-task-app-wireframes.canvas.tsx"
Cohesion: 0.25
Nodes (18): ChildAvatar(), CoinBadge(), FamilyIllustration(), FamilyTaskAppWireframes(), GoalProgress(), KidBalanceCard(), KidTaskRow(), ParentBalanceCard() (+10 more)

### Community 63 - "clone"
Cohesion: 0.11
Nodes (19): add(), clone(), div(), divByPoint(), filter(), getAndRemove(), _getAndRemoveByKey(), has() (+11 more)

### Community 64 - "map-layers-panel.tsx"
Cohesion: 0.08
Nodes (26): MapPage(), styles, MapWeb(), asBoolean(), asIds(), DEFAULT_CHILD_MARKER_COLOR, DEFAULT_PARENT_MARKER_COLOR, DEFAULT_SECTIONS (+18 more)

### Community 65 - "use-register-parent-device.ts"
Cohesion: 0.10
Nodes (10): RegisteredDevice, API_URL, EVENTS_WS_URL, LOCATION_WS_URL, WS_URL, wsBaseUrl, avatarCache, AvatarUser (+2 more)

### Community 66 - "step1-onboarding-design.canvas.tsx"
Cohesion: 0.29
Nodes (16): AddChildScreenBody(), ChildCard(), ChildScanQrScreenBody(), FamilyIllustration(), Field(), GhostBtn(), ModeTabs(), notes (+8 more)

### Community 67 - "n"
Cohesion: 0.13
Nodes (17): A(), an(), n(), fy(), gy(), hy(), ji(), k() (+9 more)

### Community 68 - "constructor"
Cohesion: 0.12
Nodes (17): addImages(), calculateScaledKey(), cc(), constructor(), cv(), _down(), Fu(), initializeIndex() (+9 more)

### Community 69 - "use-wishlist-progress.ts"
Cohesion: 0.48
Nodes (5): allocateBalance(), getRewardGoal(), RewardGoal, summarizeWishlist(), WishStatus

### Community 70 - "role-routes.tsx"
Cohesion: 0.16
Nodes (7): HomeRoute(), RewardsHistoryRoute(), TasksRoute(), WalletRoute(), useViewerRole(), greetingKey(), ParentHomePage()

### Community 71 - "pe"
Cohesion: 0.23
Nodes (16): me(), y_(), b(), be(), d(), _e(), f(), ge() (+8 more)

### Community 72 - "ui/map-zone.tsx"
Cohesion: 0.16
Nodes (13): createLocationZone(), fetchLocationZones(), LocationZoneInput, updateLocationZone(), useLocationZones(), zonesKeys, MapZone, ZonePoint (+5 more)

### Community 73 - "setPaintProperty"
Cohesion: 0.14
Nodes (15): dc(), fc(), fire(), gradientExpression(), _handleOverridablePaintPropertyUpdate(), _handleSpecialPaintPropertyUpdate(), jd(), listens() (+7 more)

### Community 74 - "paths"
Cohesion: 0.13
Nodes (14): expo/tsconfig.base, compilerOptions, baseUrl, ignoreDeprecations, paths, strict, exclude, extends (+6 more)

### Community 75 - "parent-invite-code.tsx"
Cohesion: 0.12
Nodes (18): react-native-reanimated, EASE_IN_OUT, EASE_OUT, useNewCodeGlow(), ResetInviteCodeRow(), ResetInviteCodeRowProps, styles, ResetInviteCodeSheet() (+10 more)

### Community 76 - "l"
Cohesion: 0.14
Nodes (14): ad(), anchorPoint(), bm(), dt(), getTilePoint(), l(), loadGeometry(), lt() (+6 more)

### Community 77 - "auth-api.ts"
Cohesion: 0.15
Nodes (18): deleteMyAvatar(), updateMe(), uploadMyAvatar(), meKeys, AccountKind, ChangePasswordPayload, LoginPayload, MessageResponse (+10 more)

### Community 78 - "LetterAvatar"
Cohesion: 0.13
Nodes (14): ChildOverview, ChildCard(), ChildCardProps, styles, SnapCarouselOptions, useSnapCarousel(), SnapCarouselProps, styles (+6 more)

### Community 79 - "ui/family.tsx"
Cohesion: 0.14
Nodes (15): countChildTasks(), countTasks(), filterTasks(), TaskFilter, FamilyPage(), NO_MEMBERS, NO_TASKS, photo() (+7 more)

### Community 80 - "use-register-parent-device.ts"
Cohesion: 0.10
Nodes (24): deviceLabel(), later(), LiveLocation, LocationStore, useLiveHiddenAccess(), useLiveLocations(), useLocationStore, FamilyLocation (+16 more)

### Community 82 - "hasDebugData"
Cohesion: 0.17
Nodes (13): _addCollisionDebugVertex(), addCollisionDebugVertices(), addDebugCollisionBoxes(), destroy(), destroyDebugData(), generateCollisionDebugBuffers(), getVertexAttributes(), hasDebugData() (+5 more)

### Community 83 - "ui/registration.tsx"
Cohesion: 0.19
Nodes (14): requestError(), RegistrationForm, validateLogin(), HintTone, Login(), styles, EMPTY_FORM, Field (+6 more)

### Community 84 - "en.ts"
Cohesion: 0.21
Nodes (9): i18next@^26.5.8, i18next, CustomTypeOptions, i18next, DeepStrings, Dictionary, en, ExtraPluralForms (+1 more)

### Community 85 - "zm"
Cohesion: 0.20
Nodes (12): Am(), Dm(), em(), fm(), jm(), km(), Lm(), nm() (+4 more)

### Community 86 - "queryIntersectsFeature"
Cohesion: 0.20
Nodes (12): dd(), gm(), Gu(), Hm(), Ju(), Ku(), _m(), qu() (+4 more)

### Community 87 - "expo-linear-gradient"
Cohesion: 0.05
Nodes (31): expo-linear-gradient, BadgeSize, ICON_SIZE, styles, EarnGoalCard(), EarnGoalCardProps, Goal, percent() (+23 more)

### Community 88 - "family-color-palettes.canvas.tsx"
Cohesion: 0.35
Nodes (10): BASE, FamilyColorPalettes(), FamilyTheme, MiniPhone(), SOFT, Swatch(), ThemeCardClean(), THEMES (+2 more)

### Community 89 - "i"
Cohesion: 0.22
Nodes (11): ac(), ay(), cy(), ic(), id(), ly(), oy(), sy() (+3 more)

### Community 90 - "jy"
Cohesion: 0.20
Nodes (11): by(), eb(), ey(), iy(), jy(), ny(), ry(), ty() (+3 more)

### Community 91 - "Expo Router Navigation"
Cohesion: 0.22
Nodes (10): Expo Router Data Loaders, Offline Support and Cancellation, Expo Networking Guidance, Form Sheet Presentation, Route Structure, Native Header Search, Native Tabs, Native Toolbars and Headers (+2 more)

### Community 93 - "canvases/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 94 - "obsidian-done/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 95 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, format, format:check, ios, lint, lint:fix, lint:fsd (+2 more)

### Community 96 - "eh"
Cohesion: 0.20
Nodes (10): ah(), eh(), ih(), jh(), Mh(), nh(), qm(), rh() (+2 more)

### Community 97 - "en"
Cohesion: 0.27
Nodes (10): bc(), completeTask(), process(), processTask(), receive(), Sc(), sendAsync(), vc() (+2 more)

### Community 98 - "i18n/index.ts"
Cohesion: 0.05
Nodes (43): react-native-safe-area-context, ChildChip(), ChildChipProps, ChipChild, styles, WishProgress, FILLS, styles (+35 more)

### Community 99 - "T"
Cohesion: 0.29
Nodes (10): Y, z, _finishRequestTiming(), _getEtagUnmodifiedResult(), _getExpiryData(), loadData(), loadTile(), _parseWorkerTile() (+2 more)

### Community 100 - "family-color-palettes-new.canvas.tsx"
Cohesion: 0.44
Nodes (8): FamilyColorPalettesNew(), FamilyTheme, MiniPhone(), Swatch(), ThemePreview(), THEMES, tint(), WelcomeBlock()

### Community 101 - "loadAndProcessGeoJSON"
Cohesion: 0.25
Nodes (9): dy(), r(), cn(), ln(), _filterGeoJSON(), _getFilterPredicate(), loadAndProcessGeoJSON(), oe() (+1 more)

### Community 102 - "paint"
Cohesion: 0.22
Nodes (9): gC(), Hc(), hp(), nb(), ng(), paint(), qx(), Vd() (+1 more)

### Community 103 - "task/index.ts"
Cohesion: 0.13
Nodes (26): submitServerTask(), setTaskStatus(), tickChecklistItem(), Task, TASK_PHOTOS_MAX, NO_PHOTOS, NoteDraftState, useNoteDraft() (+18 more)

### Community 104 - "transaction-card.tsx"
Cohesion: 0.24
Nodes (16): formatBalance(), formatTransactionTotal(), transactionCode(), BalanceNote(), ChildTransactionCard(), ChildTransactionCardProps, Details(), fullDate() (+8 more)

### Community 105 - "transfer-ownership-button.tsx"
Cohesion: 0.18
Nodes (11): transferOwnership(), cancelServerTask(), cancelTask(), useCancelTask(), CancelTaskButton(), CancelTaskSheet(), useTransferOwnership(), styles (+3 more)

### Community 106 - "Expo Upgrade"
Cohesion: 0.25
Nodes (8): expo-audio Migration, expo-video Migration, Native Tabs Migration, New Architecture, React 19, React Compiler, Expo Router Migration, Expo Upgrade

### Community 107 - "ref_cursor"
Cohesion: 0.36
Nodes (6): MainScreensComparison(), Phone(), Theme, ThemeRow(), THEMES, tint()

### Community 108 - "splitTile"
Cohesion: 0.36
Nodes (8): addTileFeatures(), getTile(), Hh(), initialize(), invalidateTiles(), kh(), splitTile(), updateIndex()

### Community 109 - "get"
Cohesion: 0.29
Nodes (8): backfillBorder(), get(), _getByteView(), getPixels(), _idx(), sampleBilinear(), unpack(), _unpackAtIndex()

### Community 110 - "eh"
Cohesion: 0.25
Nodes (8): ch(), im(), lh(), sh(), Sm(), wm(), xm(), zh()

### Community 111 - "activity-card.tsx"
Cohesion: 0.17
Nodes (10): ActivityCard(), ActivityCardProps, ActivityTone, GRADIENTS, REWARD_STYLES, SUBTITLE_STYLES, styles, FeedItem() (+2 more)

### Community 112 - "Wu"
Cohesion: 0.33
Nodes (7): cd(), fd(), ld(), pd(), sd(), ud(), Wu()

### Community 113 - "oh"
Cohesion: 0.33
Nodes (7): dh(), fh(), filterUpdate(), oh(), ph(), uh(), updateData()

### Community 114 - "xt"
Cohesion: 0.29
Nodes (7): dn(), jn(), off(), On(), once(), transitioned(), xt()

### Community 115 - "interpolate"
Cohesion: 0.33
Nodes (7): hg(), hr(), interpolate(), mr(), Or(), pr(), _r()

### Community 116 - "child-wallet.tsx"
Cohesion: 0.10
Nodes (32): TaskIconBadge(), fetchParentFunds(), ParentWalletDto, toFunds(), formatMoney(), getParentFunds(), ParentFunds, FundsBar() (+24 more)

### Community 117 - "api-image.web.tsx"
Cohesion: 0.38
Nodes (6): ApiImage(), HeaderSource, load(), loaded, ready, withHeaders()

### Community 118 - "en"
Cohesion: 0.24
Nodes (10): Cn(), en(), hn(), mn(), nn(), qt(), rn(), Sn() (+2 more)

### Community 119 - "tasks-query.ts"
Cohesion: 0.19
Nodes (12): TaskViewer, fetchTasks(), taskKeys, useTasks(), group(), sortTasksByUrgency(), time(), AFFECTS (+4 more)

### Community 120 - "day-summary.tsx"
Cohesion: 0.26
Nodes (9): KindColors, OPERATION_KIND_COLORS, formatAmount(), OperationKind, KindCube(), DaySummaryProps, styles, Total() (+1 more)

### Community 121 - "appendLeaves"
Cohesion: 0.33
Nodes (6): appendLeaves(), getChildren(), getClusterExpansionZoom(), getLeaves(), getOriginId(), getOriginZoom()

### Community 122 - "getColorRampTextures"
Cohesion: 0.33
Nodes (6): _colorRampChanged(), _createColorRamp(), getColorRampTextures(), getUnpackVector(), Kd(), pack()

### Community 123 - "layout"
Cohesion: 0.33
Nodes (6): eg(), hd(), layout(), pp(), qy(), um()

### Community 124 - "ii"
Cohesion: 0.33
Nodes (6): ai(), Di(), ii(), ni(), oi(), ti()

### Community 125 - "_h"
Cohesion: 0.40
Nodes (5): bh(), finish(), _h(), vh(), yh()

### Community 126 - "DoneReceived Project Guidance"
Cohesion: 0.40
Nodes (3): Mobile API Security Checklist, Repository Skill Catalog, DoneReceived Project Guidance

### Community 127 - "metro.config.js"
Cohesion: 0.40
Nodes (4): config, { getDefaultConfig }, expo@~56.0.22, expo

### Community 128 - "Seven-Step Task Definition Form"
Cohesion: 0.40
Nodes (5): Reward and Penalty Configuration, Deadline and Recurrence Configuration, Task Creation Screen, Seven-Step Task Definition Form, Task Image and Icon Selection

### Community 129 - "kb"
Cohesion: 0.40
Nodes (5): Ab(), Fb(), jb(), kb(), ob()

### Community 130 - "task-short-view.tsx"
Cohesion: 0.21
Nodes (7): TaskShortViewProps, RewardButton(), RewardButtonProps, RewardVariant, styles, styles, TaskShortView()

### Community 131 - "_refreshViews"
Cohesion: 0.40
Nodes (5): freeBufferAfterUpload(), _refreshViews(), reserve(), resize(), _trim()

### Community 132 - "update"
Cohesion: 0.40
Nodes (5): update(), _updateDomImage(), _updateRawData(), _uploadDomImage(), _uploadRawData()

### Community 133 - "queryRadius"
Cohesion: 0.50
Nodes (4): cg(), nd(), queryRadius(), rd()

### Community 134 - "day-column.tsx"
Cohesion: 0.29
Nodes (10): DayTotals, formatMonthShort(), formatWeekdayShort(), Bar3D(), Cube(), DayColumn(), DayColumnProps, FutureDayColumn() (+2 more)

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

### Community 160 - "bar-3d.tsx"
Cohesion: 0.22
Nodes (8): DEPTH_X, FUTURE_BAR_HEIGHT, Bar3DProps, Block, CubeColors, CubeProps, FUTURE_COLORS, styles

## Knowledge Gaps
- **45 isolated node(s):** `Cancelled`, `Done`, `Pending`, `expo/tsconfig.base`, `expo-audio Migration` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1017 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-native`, `task-short-view.tsx`, `ui/map-layers.tsx`, `ui/index.ts`, `ui/transactions.tsx`, `user/index.ts`, `package.json`, `wish-form-sheet.tsx`, `ui/family.tsx`, `lib/index.ts`, `my-tasks.tsx`, `ui/tasks.tsx`, `day-column.tsx`, `child-task-card.tsx`, `child-home.tsx`, `mvp-full-design-variants.canvas.tsx`, `ui/change-password.tsx`, `ui/family-setup.tsx`, `showToast`, `operation/index.ts`, `task-form-screen.tsx`, `ui/role-select.tsx`, `bus-playback.ts`, `zones.ts`, `ui/verify-email.tsx`, `mvp-apple-premium.canvas.tsx`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `showToast`, `child-devices.tsx`, `create-task-form.tsx`, `map.web.tsx`, `mvp-family-premium-mobile.canvas.tsx`, `task-list.tsx`, `reject-reason-sheet.tsx`, `avatar-cropper.tsx`, `family-task-app-wireframes.canvas.tsx`, `map-layers-panel.tsx`, `use-register-parent-device.ts`, `step1-onboarding-design.canvas.tsx`, `use-wishlist-progress.ts`, `ui/map-zone.tsx`, `parent-invite-code.tsx`, `LetterAvatar`, `ui/family.tsx`, `use-register-parent-device.ts`, `ui/registration.tsx`, `expo-linear-gradient`, `family-color-palettes.canvas.tsx`, `canvases/mvp-c4-business-logic.canvas.tsx`, `obsidian-done/mvp-c4-business-logic.canvas.tsx`, `i18n/index.ts`, `family-color-palettes-new.canvas.tsx`, `task/index.ts`, `transaction-card.tsx`, `transfer-ownership-button.tsx`, `ref_cursor`, `child-wallet.tsx`, `api-image.web.tsx`, `day-summary.tsx`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **What connects `Cancelled`, `Done`, `Pending` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `maplibre-gl-shared.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005952380952380952 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `task-short-view.tsx`, `ui/map-layers.tsx`, `server-tasks-api.ts`, `ui/transactions.tsx`, `user/index.ts`, `package.json`, `wish-form-sheet.tsx`, `ui/index.ts`, `day-column.tsx`, `ui/family.tsx`, `lib/index.ts`, `my-tasks.tsx`, `ui/tasks.tsx`, `day-column.tsx`, `child-task-card.tsx`, `child-home.tsx`, `ui/change-password.tsx`, `ui/family-setup.tsx`, `showToast`, `operation/index.ts`, `task-form-screen.tsx`, `ui/role-select.tsx`, `bar-3d.tsx`, `ui/verify-email.tsx`, `feed-api.ts`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `showToast`, `child-devices.tsx`, `create-task-form.tsx`, `task-list.tsx`, `reject-reason-sheet.tsx`, `avatar-cropper.tsx`, `PickedPhoto`, `map-layers-panel.tsx`, `ui/map-zone.tsx`, `parent-invite-code.tsx`, `LetterAvatar`, `ui/family.tsx`, `ui/registration.tsx`, `expo-linear-gradient`, `i18n/index.ts`, `task/index.ts`, `transaction-card.tsx`, `transfer-ownership-button.tsx`, `activity-card.tsx`, `child-wallet.tsx`, `api-image.web.tsx`, `day-summary.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.05667485667485667 - nodes in this community are weakly interconnected._
- **Why does `maplibre-gl` connect `zones.ts` to `road-path.ts`, `map/model/types.ts`, `map.web.tsx`, `package.json`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `ui/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04850964348334307 - nodes in this community are weakly interconnected._